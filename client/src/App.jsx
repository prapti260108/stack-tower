import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameCanvas from './components/game/GameCanvas';
import GameHUD from './components/game/GameHUD';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import HowToPlayModal from './screens/HowToPlayModal';
import PauseModal from './screens/PauseModal';
import GameOverModal from './screens/GameOverModal';
import SettingsModal from './screens/SettingsModal';
import CosmeticsModal from './screens/CosmeticsModal';
import LeaderboardModal from './screens/LeaderboardModal';
import { storageService } from './services/storageService';
import { audioService } from './services/audioService';
import { analyticsService } from './services/analyticsService';
import { apiService } from './services/apiService';
import { GAME_CONFIG } from './config/gameConfig';

export default function App() {
  // Screens & Navigation: 'SPLASH' | 'HOME' | 'PLAYING'
  const [currentScreen, setCurrentScreen] = useState('SPLASH');

  // Modal Visibility
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showCosmetics, setShowCosmetics] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Gameplay State
  const [score, setScore] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [engineState, setEngineState] = useState(GAME_CONFIG.states.READY);
  const [placementFeedback, setPlacementFeedback] = useState(null);

  // Persistent Player Stats, Economy, & Cosmetics
  const [stats, setStats] = useState(storageService.getStats());
  const [settings, setSettings] = useState(storageService.getSettings());
  const [stars, setStars] = useState(storageService.getStars());
  const [cosmetics, setCosmetics] = useState(storageService.getCosmetics());
  const [username, setUsername] = useState(storageService.getUsername());
  const [playerId] = useState(() => storageService.getPlayerId());

  const [gameOverData, setGameOverData] = useState({
    score: 0,
    bestScore: 0,
    isNewBest: false,
    highestCombo: 0,
    totalPlacements: 0,
    starsEarned: 0
  });

  const canvasRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  // Local storage is always the source of a playable offline game. The API is
  // an optional sync layer, so an unavailable server must not block gameplay.
  const [mongoStatus, setMongoStatus] = useState({
    checking: true,
    browserOnline: typeof navigator === 'undefined' ? true : navigator.onLine,
    apiAvailable: false,
    connected: false
  });

  const refreshMongoStatus = useCallback(async () => {
    const browserOnline = typeof navigator === 'undefined' ? true : navigator.onLine;
    if (!browserOnline) {
      setMongoStatus({ checking: false, browserOnline: false, apiAvailable: false, connected: false });
      return;
    }

    setMongoStatus((current) => ({ ...current, checking: true, browserOnline: true }));
    const result = await apiService.getMongoStatus();
    const isConnected = Boolean(result?.success && result.data?.connected);
    const apiAvailable = Boolean(result?.success);

    setMongoStatus({
      checking: false,
      browserOnline: true,
      apiAvailable,
      connected: isConnected,
      host: result?.success ? result.data?.host : null
    });

    // When connection is available, automatically flush and sync offline queued runs to MongoDB!
    if (apiAvailable || isConnected) {
      apiService.syncOfflineQueue(storageService).catch(() => {});
    }
  }, []);

  // Initialize audio settings & player profile
  useEffect(() => {
    audioService.updateSettings(settings);
    const playerId = storageService.getPlayerId();
    // Non-blocking sync with backend
    apiService.registerPlayer(playerId).catch(() => {});
    refreshMongoStatus();

    window.addEventListener('online', refreshMongoStatus);
    window.addEventListener('offline', refreshMongoStatus);
    return () => {
      window.removeEventListener('online', refreshMongoStatus);
      window.removeEventListener('offline', refreshMongoStatus);
    };
  }, [refreshMongoStatus]);

  // A hidden mobile browser must never allow the simulation to advance without
  // the player. Surface the existing pause controls when the app is backgrounded.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'hidden' || currentScreen !== 'PLAYING') return;

      canvasRef.current?.pauseGame();
      setShowPause(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentScreen]);

  // Update Settings
  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
    audioService.updateSettings(newSettings);
  };

  // Start a new game run
  const handleStartGame = () => {
    // Check first-time tutorial
    if (!storageService.isTutorialCompleted()) {
      setShowHowToPlay(true);
      storageService.setTutorialCompleted(true);
      analyticsService.track('tutorial_step', { step: 'auto_first_launch' });
      return;
    }

    setShowGameOver(false);
    setShowPause(false);
    setScore(0);
    setComboStreak(0);
    setCurrentScreen('PLAYING');

    analyticsService.track('game_start', { timestamp: Date.now() });

    // Allow canvas mounting before resetting engine
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.resetGame();
        canvasRef.current.startGame();
      }
    }, 50);
  };

  // Engine Callbacks
  const handleScoreUpdate = useCallback((data) => {
    setScore(data.score);
    setComboStreak(data.comboStreak);

    if (data.placementType === 'PERFECT' || data.placementType === 'NEAR_PERFECT') {
      setPlacementFeedback(data.placementType);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = setTimeout(() => {
        setPlacementFeedback(null);
      }, 700);
    }
  }, []);

  const handleStateChange = useCallback((newState) => {
    setEngineState(newState);
  }, []);

  const handleGameOver = useCallback((finalStats) => {
    const { updated, isNewBest } = storageService.updateStats(
      finalStats.score,
      finalStats.highestCombo,
      finalStats.totalPlacements
    );

    // Award earned stars to economy
    const earnedStars = finalStats.starsEarned || 0;
    const updatedStars = storageService.addStars(earnedStars);
    setStars(updatedStars);

    setStats(updated);
    setGameOverData({
      score: finalStats.score,
      bestScore: updated.bestScore,
      isNewBest,
      highestCombo: finalStats.highestCombo,
      totalPlacements: finalStats.totalPlacements,
      starsEarned: earnedStars
    });

    setShowGameOver(true);

    analyticsService.track('game_end', {
      score: finalStats.score,
      duration: finalStats.durationSec,
      isBestScore: isNewBest,
      starsEarned: earnedStars
    });

    // 1. Record in local device run history (100% offline device leaderboard)
    storageService.recordLocalRun({
      score: finalStats.score,
      highestCombo: finalStats.highestCombo,
      totalPlacements: finalStats.totalPlacements,
      starsEarned: earnedStars,
      durationSec: finalStats.durationSec
    });

    // 2. Cloud sync or offline queue for MongoDB Atlas
    const currentPlayerId = storageService.getPlayerId();
    const sessionPayload = {
      playerId: currentPlayerId,
      score: finalStats.score,
      duration: finalStats.durationSec,
      endReason: 'MISS',
      isBestScore: isNewBest,
      starsEarned: earnedStars,
      username
    };

    apiService.recordGameSession(sessionPayload).then((res) => {
      if (!res || !res.success) {
        // If server is offline or unreachable, queue for auto-sync when online
        storageService.queueOfflineRun(sessionPayload);
      }
    }).catch(() => {
      storageService.queueOfflineRun(sessionPayload);
    });

    apiService.updatePlayer(currentPlayerId, {
      bestScore: updated.bestScore,
      totalGames: updated.totalGames,
      highestCombo: updated.highestCombo,
      totalPlacements: updated.totalPlacements,
      stars: updatedStars
    }).catch(() => {});
  }, [username]);

  // Cosmetics & Theme Handlers
  const handleEquipMaterial = (materialId) => {
    const updated = { ...cosmetics, selectedMaterial: materialId };
    setCosmetics(updated);
    storageService.saveCosmetics(updated);
    if (canvasRef.current) {
      canvasRef.current.setTheme(materialId, cosmetics.selectedBackground);
    }
    analyticsService.track('content_unlock', { type: 'equip_material', materialId });
  };

  const handleEquipBackground = (bgId) => {
    const updated = { ...cosmetics, selectedBackground: bgId };
    setCosmetics(updated);
    storageService.saveCosmetics(updated);
    if (canvasRef.current) {
      canvasRef.current.setTheme(cosmetics.selectedMaterial, bgId);
    }
    analyticsService.track('content_unlock', { type: 'equip_background', bgId });
  };

  const handleUnlockMaterial = (theme) => {
    const res = storageService.spendStars(theme.cost);
    if (res.success) {
      setStars(res.balance);
      const updated = {
        ...cosmetics,
        unlockedMaterials: [...cosmetics.unlockedMaterials, theme.id],
        selectedMaterial: theme.id
      };
      setCosmetics(updated);
      storageService.saveCosmetics(updated);
      if (canvasRef.current) {
        canvasRef.current.setTheme(theme.id, cosmetics.selectedBackground);
      }
      audioService.playPerfect(3);
      analyticsService.track('content_unlock', { type: 'unlock_material', materialId: theme.id, cost: theme.cost });
    }
  };

  const handleUnlockBackground = (bg) => {
    const res = storageService.spendStars(bg.cost);
    if (res.success) {
      setStars(res.balance);
      const updated = {
        ...cosmetics,
        unlockedBackgrounds: [...cosmetics.unlockedBackgrounds, bg.id],
        selectedBackground: bg.id
      };
      setCosmetics(updated);
      storageService.saveCosmetics(updated);
      if (canvasRef.current) {
        canvasRef.current.setTheme(cosmetics.selectedMaterial, bg.id);
      }
      audioService.playPerfect(3);
      analyticsService.track('content_unlock', { type: 'unlock_background', bgId: bg.id, cost: bg.cost });
    }
  };

  const handleUpdateUsername = (newName) => {
    const saved = storageService.saveUsername(newName);
    setUsername(saved);
  };

  const handleResetData = () => {
    storageService.clearAll();
    setStats(storageService.getStats());
    setSettings(storageService.getSettings());
    setStars(storageService.getStars());
    setCosmetics(storageService.getCosmetics());
    setUsername(storageService.getUsername());
    if (canvasRef.current) {
      canvasRef.current.setTheme('prism_neon', 'midnight_sky');
    }
  };

  // Pause & Resume Handlers
  const handlePause = () => {
    if (engineState !== GAME_CONFIG.states.PLAYING && engineState !== GAME_CONFIG.states.FALLING) {
      return;
    }
    if (canvasRef.current) {
      canvasRef.current.pauseGame();
    }
    setShowPause(true);
    analyticsService.track('pause', { score });
  };

  const handleResume = () => {
    setShowPause(false);
    if (canvasRef.current) {
      canvasRef.current.resumeGame();
    }
    analyticsService.track('resume', { score });
  };

  const handleRestart = () => {
    setShowPause(false);
    setShowGameOver(false);
    handleStartGame();
    analyticsService.track('restart', { previousScore: score });
  };

  const handleQuitToMenu = () => {
    setShowPause(false);
    setShowGameOver(false);
    audioService.stopBGM();
    setCurrentScreen('HOME');
    analyticsService.track('quit', { score });
  };

  const handleToggleMusic = () => {
    const updated = { ...settings, music: !settings.music };
    handleUpdateSettings(updated);
  };

  const activeSettings = {
    ...settings,
    selectedMaterial: cosmetics.selectedMaterial,
    selectedBackground: cosmetics.selectedBackground
  };

  return (
    <div className="relative w-full h-full min-w-0 bg-slate-950 text-white overflow-hidden select-none font-sans">
      {/* 1. Splash Screen */}
      {currentScreen === 'SPLASH' && (
        <SplashScreen onFinish={() => setCurrentScreen('HOME')} />
      )}

      {/* 2. Home Screen */}
      {currentScreen === 'HOME' && (
        <HomeScreen
          onPlay={handleStartGame}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenCosmetics={() => setShowCosmetics(true)}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          stats={stats}
          stars={stars}
          mongoStatus={mongoStatus}
          musicEnabled={settings.music}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {/* 3. Gameplay Canvas & Minimal HUD */}
      {currentScreen === 'PLAYING' && (
        <div className="relative w-full h-full">
          <GameCanvas
            ref={canvasRef}
            onScoreUpdate={handleScoreUpdate}
            onStateChange={handleStateChange}
            onGameOver={handleGameOver}
            settings={activeSettings}
          />

          <GameHUD
            score={score}
            bestScore={stats?.bestScore || 0}
            comboStreak={comboStreak}
            onPause={handlePause}
            isReady={engineState === GAME_CONFIG.states.READY}
            placementFeedback={placementFeedback}
            musicEnabled={settings.music}
            onToggleMusic={handleToggleMusic}
          />
        </div>
      )}

      {/* 4. Modals */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
        onStartGame={currentScreen === 'HOME' ? handleStartGame : undefined}
      />

      <PauseModal
        isOpen={showPause}
        onResume={handleResume}
        onRestart={handleRestart}
        onOpenSettings={() => setShowSettings(true)}
        onQuit={handleQuitToMenu}
      />

      <GameOverModal
        isOpen={showGameOver}
        score={gameOverData.score}
        bestScore={gameOverData.bestScore}
        isNewBest={gameOverData.isNewBest}
        highestCombo={gameOverData.highestCombo}
        totalPlacements={gameOverData.totalPlacements}
        starsEarned={gameOverData.starsEarned || 0}
        onReplay={handleRestart}
        onHome={handleQuitToMenu}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenCosmetics={() => setShowCosmetics(true)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onReplayTutorial={() => setShowHowToPlay(true)}
        mongoStatus={mongoStatus}
        onRefreshMongoStatus={refreshMongoStatus}
        onResetData={handleResetData}
      />

      <CosmeticsModal
        isOpen={showCosmetics}
        onClose={() => setShowCosmetics(false)}
        stars={stars}
        cosmetics={cosmetics}
        onEquipMaterial={handleEquipMaterial}
        onEquipBackground={handleEquipBackground}
        onUnlockMaterial={handleUnlockMaterial}
        onUnlockBackground={handleUnlockBackground}
      />

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        playerId={playerId}
        currentScore={score}
        username={username}
        onUpdateUsername={handleUpdateUsername}
        mongoStatus={mongoStatus}
      />
    </div>
  );
}
