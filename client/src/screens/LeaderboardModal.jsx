import React, { useState, useEffect } from 'react';
import { X, Trophy, Medal, Flame, Star, RefreshCw, Edit2, Check, Database, Smartphone, Globe, CloudOff } from 'lucide-react';
import Button from '../components/common/Button';
import apiService from '../services/apiService';
import storageService from '../services/storageService';

export default function LeaderboardModal({
  isOpen,
  onClose,
  playerId,
  currentScore = 0,
  username = 'Player',
  onUpdateUsername,
  mongoStatus
}) {
  const [activeTab, setActiveTab] = useState('cloud'); // 'cloud' | 'local'
  const [leaderboard, setLeaderboard] = useState([]);
  const [localRuns, setLocalRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(username);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    setNameInput(username);
  }, [username]);

  const loadLocalRuns = () => {
    const list = storageService.getLocalLeaderboard();
    setLocalRuns(list);
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    loadLocalRuns();
    try {
      const res = await apiService.getLeaderboard(20);
      if (res && res.success && res.data && res.data.leaderboard) {
        setLeaderboard(res.data.leaderboard);
      } else {
        // If cloud fails, gracefully switch to local tab if empty
        if (!mongoStatus?.connected) {
          setActiveTab('local');
        }
      }
    } catch (e) {
      console.warn('Failed to fetch leaderboard:', e);
      setActiveTab('local');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLocalRuns();
      fetchLeaderboard();
      // If offline, start on local tab
      if (!mongoStatus?.connected && !mongoStatus?.apiAvailable) {
        setActiveTab('local');
      }
    }
  }, [isOpen]);

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    const clean = nameInput.trim().slice(0, 24);
    if (onUpdateUsername) {
      onUpdateUsername(clean);
    }
    setEditingName(false);
    setStatusMsg('Saved!');
    setTimeout(() => setStatusMsg(null), 2000);

    try {
      await apiService.updatePlayerName(playerId, clean);
      fetchLeaderboard();
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900/95 border border-slate-750 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-white">LEADERBOARD</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-2 h-2 rounded-full ${mongoStatus?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-[10px] text-slate-400">
                  {mongoStatus?.connected ? 'MongoDB Atlas Cloud' : 'Local / Offline Mode'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              size="icon"
              onClick={fetchLeaderboard}
              disabled={loading}
              className="w-9 h-9 text-slate-400 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </Button>
            <Button
              variant="glass"
              size="icon"
              onClick={onClose}
              className="w-9 h-9 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Player Name Strip */}
        <div className="my-3 px-4 py-2.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs text-slate-400 font-semibold">Player Handle:</span>
            {editingName ? (
              <input
                type="text"
                value={nameInput}
                maxLength={20}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                autoFocus
                className="bg-slate-900 border border-cyan-500 text-white text-xs px-2 py-1 rounded-lg outline-none w-32 font-bold"
              />
            ) : (
              <span className="text-xs font-bold text-cyan-300">{username}</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {statusMsg && <span className="text-[10px] text-emerald-400 font-bold mr-1">{statusMsg}</span>}
            {editingName ? (
              <button
                onClick={handleSaveName}
                className="p-1 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                title="Save"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Edit name"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher: Online Cloud vs Offline Device */}
        <div className="grid grid-cols-2 gap-2 mb-3 p-1 bg-slate-800/60 rounded-2xl border border-slate-750">
          <button
            onClick={() => setActiveTab('cloud')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cloud'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Cloud Rankings</span>
            {mongoStatus?.connected && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-pulse ml-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('local')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'local'
                ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Device High Scores</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60 text-slate-300">
              {localRuns.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Cloud Leaderboard */}
        {activeTab === 'cloud' && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar my-1">
            {!mongoStatus?.connected && !mongoStatus?.apiAvailable ? (
              <div className="py-8 px-4 text-center rounded-2xl bg-slate-800/30 border border-slate-750/60 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 mx-auto flex items-center justify-center">
                  <CloudOff className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Offline Mode Active</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xs mx-auto">
                    Your games and high scores are 100% safely saved on this device. Connect to MongoDB Atlas to sync and view global ranks!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('local')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  View Device High Scores ({localRuns.length})
                </button>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                {loading ? 'Fetching high scores from MongoDB...' : 'No scores recorded yet. Be the first to build a tower!'}
              </div>
            ) : (
              leaderboard.map((player, idx) => {
                const isCurrentPlayer = player.playerId === playerId;
                const rank = idx + 1;

                return (
                  <div
                    key={player.playerId || idx}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl border transition-all ${
                      isCurrentPlayer
                        ? 'bg-cyan-950/40 border-cyan-400/50 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-800/30 border-slate-850 hover:border-slate-700'
                    }`}
                  >
                    {/* Rank & Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 flex items-center justify-center font-display font-black text-sm">
                        {rank === 1 ? (
                          <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md shadow-amber-400/30">
                            1
                          </div>
                        ) : rank === 2 ? (
                          <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-bold text-xs">
                            2
                          </div>
                        ) : rank === 3 ? (
                          <div className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-bold text-xs">
                            3
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">#{rank}</span>
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{player.username || `Player_${(player.playerId || '').slice(-4)}`}</span>
                          {isCurrentPlayer && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold uppercase">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 text-amber-400" />
                            {player.highestCombo || 0} Combo
                          </span>
                          <span>•</span>
                          <span>{player.totalGames || 0} Runs</span>
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className="font-display font-black text-base text-amber-400">
                        {player.bestScore || 0}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                        Points
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Local Device Runs (100% Offline) */}
        {activeTab === 'local' && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar my-1">
            {localRuns.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No local runs recorded on this device yet.<br />Play a game to start your device leaderboard!
              </div>
            ) : (
              localRuns.map((run, idx) => {
                const rank = idx + 1;
                return (
                  <div
                    key={run.id || idx}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 flex items-center justify-center font-display font-black text-sm">
                        {rank === 1 ? (
                          <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md shadow-cyan-400/30">
                            1
                          </div>
                        ) : rank === 2 ? (
                          <div className="w-6 h-6 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                            2
                          </div>
                        ) : rank === 3 ? (
                          <div className="w-6 h-6 rounded-full bg-indigo-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                            3
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">#{rank}</span>
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{run.dateStr || 'Recent Run'}</span>
                          {run.starsEarned > 0 && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-300" />
                              +{run.starsEarned}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 text-amber-400" />
                            Streak {run.highestCombo || 0}
                          </span>
                          <span>•</span>
                          <span>{run.totalPlacements || 0} blocks</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-display font-black text-base text-cyan-400">
                        {run.score}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                        Points
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span>Device Best:</span>
            <span className="font-bold text-amber-400">{currentScore} pts</span>
          </div>
          <Button variant="primary" size="sm" onClick={onClose} className="text-xs px-4">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
