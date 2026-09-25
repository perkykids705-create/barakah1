import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { GroupKhatmTask } from '../../types';
import { KhatmCelebrationBadge } from '../common/BrandMark';
import {
  Users,
  Plus,
  BookOpen,
  Calendar,
  CheckCircle2,
  Copy,
  Clock,
  Sparkles,
  Award,
  Share2,
} from 'lucide-react';

export const GroupKhatmModule: React.FC = () => {
  const {
    currentUser,
    language,
    groupTasks,
    createGroupTask,
    claimGroupTaskPortion,
    completeGroupTaskPortion,
    extendGroupTaskDeadline,
    closeGroupTask,
    showNotification,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  const [selectedTask, setSelectedTask] = useState<GroupKhatmTask | null>(groupTasks[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');

  // Create task form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'para' | 'surah_repetition'>('para');
  const [newTargetSurah, setNewTargetSurah] = useState('Surah Ya-Sin');
  const [newRepetitionGoal, setNewRepetitionGoal] = useState<number>(121);
  const [newTargetDate, setNewTargetDate] = useState('2026-10-15');

  // Extend deadline modal state
  const [extendingTaskId, setExtendingTaskId] = useState<string | null>(null);
  const [newExtDate, setNewExtDate] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const result = createGroupTask(
      newTitle,
      newDesc,
      newType,
      newTargetDate,
      newType === 'surah_repetition' ? newTargetSurah : undefined,
      newType === 'surah_repetition' ? Number(newRepetitionGoal) : undefined
    );
    if (result.success) {
      setShowCreateModal(false);
      setNewTitle('');
      setNewDesc('');
    } else if (result.error) {
      showNotification(result.error);
    }
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCodeInput.trim().toUpperCase();
    const found = groupTasks.find((t) => t.code.toUpperCase() === code);
    if (found) {
      setSelectedTask(found);
      setJoinCodeInput('');
      showNotification(`Joined task: ${found.title}`);
    } else {
      showNotification(`No active khatm task found with code ${code}`);
    }
  };

  const copyJoinLink = (task: GroupKhatmTask) => {
    const link = `${window.location.origin}/#join=${task.code}`;
    navigator.clipboard?.writeText?.(link);
    showNotification(`Join link & code (${task.code}) copied to clipboard!`);
  };

  const currentTask = selectedTask ? groupTasks.find((t) => t.id === selectedTask.id) || selectedTask : null;

  return (
    <div className="space-y-6">
      {showCelebration && <KhatmCelebrationBadge onDismiss={() => setShowCelebration(false)} />}

      {/* 1. TOP HEADER & ACTIONS */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#0E8C74]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16241A]">{t('groupKhatmTitle')}</h2>
          </div>
          <p className="text-sm sm:text-base text-[#5D6B5A] mt-1.5 max-w-xl">
            {t('taskDescPlaceholder')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Join with Code input */}
          <form onSubmit={handleJoinByCode} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t('enterCodePlaceholder')}
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
              data-no-phonetic="true"
              className="w-48 sm:w-56 px-4 py-2.5 rounded-2xl border border-stone-200 text-sm font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#0E8C74]/30"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-[#16241A] text-sm font-bold transition-colors cursor-pointer"
            >
              {t('joinBtn')}
            </button>
          </form>

          {/* Create Khatm CTA */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#0E8C74] hover:bg-[#0b705d] text-white font-extrabold text-sm flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createKhatm')}</span>
          </button>
        </div>
      </div>

      {/* 2. TASK SELECTOR CAROUSEL / LIST */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-2">
        {groupTasks.map((task) => {
          const isSelected = currentTask?.id === task.id;
          return (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`p-4 sm:p-5 rounded-2xl border text-left shrink-0 w-80 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#0E8C74] shadow-md ring-2 ring-[#0E8C74]/20'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[#DAF3EC] text-[#0E8C74]">
                  {task.type === 'para' ? t('type30Juz') : t('typeSurahRepetition')}
                </span>
                <span className="text-xs font-mono font-bold text-stone-500">{task.code}</span>
              </div>
              <h4 className="text-base font-extrabold text-[#16241A] truncate">{task.title}</h4>
              <p className="text-xs sm:text-sm text-[#5D6B5A] font-medium mt-1.5">{t('targetDateLabel')}: {task.targetDate}</p>
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE TASK DETAIL & CLAIM GRID */}
      {currentTask && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          {/* Task Info Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase">
                  {currentTask.status}
                </span>
                <span className="text-xs sm:text-sm text-[#5D6B5A]">
                  Created by <strong className="text-stone-800">{currentTask.creatorName}</strong> on {currentTask.createdAt}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#16241A]">{currentTask.title}</h3>
              <p className="text-sm sm:text-base text-[#5D6B5A] mt-1.5">{currentTask.description}</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => copyJoinLink(currentTask)}
                className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-[#16241A] text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#0E8C74]" />
                <span>{currentTask.code}</span>
              </button>

              {/* Creator Deadline Extension Option (PRD §5.7) */}
              {currentUser?.id === currentTask.creatorId && (
                <button
                  onClick={() => setExtendingTaskId(currentTask.id)}
                  className="px-4 py-2.5 rounded-2xl bg-[#0E8C74]/10 hover:bg-[#0E8C74]/20 text-[#0E8C74] text-sm font-extrabold transition-colors cursor-pointer"
                >
                  {t('extendDeadline')}
                </button>
              )}
            </div>
          </div>

          {/* Chapter (Para) Khatm Grid (all 30 Juz) */}
          {currentTask.type === 'para' ? (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h4 className="text-base sm:text-lg font-extrabold text-[#16241A]">
                  {t('type30Juz')}
                </h4>
                <div className="flex flex-wrap items-center gap-3.5 text-xs sm:text-sm font-bold">
                  <span className="flex items-center gap-1.5 text-[#2E8B4F]">
                    <span className="w-3 h-3 rounded-full bg-[#2E8B4F]" /> {t('completedTasks')}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#C89B2E]">
                    <span className="w-3 h-3 rounded-full bg-[#C89B2E]" /> {t('claimedBy')}
                  </span>
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <span className="w-3 h-3 rounded-full bg-stone-300" /> {t('claimBtn')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3.5">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((paraNum) => {
                  const assignment = currentTask.assignments.find((a) => a.paraNumber === paraNum);
                  const isClaimedByMe = assignment?.userId === currentUser?.id;
                  const isCompleted = assignment?.status === 'completed';

                  return (
                    <div
                      key={paraNum}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[105px] ${
                        isCompleted
                          ? 'bg-[#E1F2E7] border-[#2E8B4F] text-[#0B2E1C]'
                          : assignment
                          ? 'bg-[#FAF0D8] border-[#C89B2E] text-[#16241A]'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black">{t('portionPara')} {paraNum}</span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-[#2E8B4F]" />
                        ) : assignment ? (
                          <span className="text-xs font-bold text-[#C89B2E]">{t('claimedBy')}</span>
                        ) : (
                          <span className="text-xs font-bold text-stone-400">{t('claimBtn')}</span>
                        )}
                      </div>

                      <div className="mt-3">
                        {assignment ? (
                          <div>
                            <p className="text-xs sm:text-sm font-bold truncate text-stone-800">{assignment.userName}</p>
                            {isClaimedByMe && !isCompleted && (
                              <button
                                onClick={() => {
                                  completeGroupTaskPortion(currentTask.id, assignment.id);
                                  setShowCelebration(true);
                                }}
                                className="w-full mt-2 py-1.5 px-2.5 rounded-xl bg-[#2E8B4F] hover:bg-[#257340] text-white text-xs font-extrabold cursor-pointer transition-colors"
                              >
                                {t('markCompletedBtn')} ✓
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => claimGroupTaskPortion(currentTask.id, paraNum)}
                            className="w-full py-1.5 px-2.5 rounded-xl bg-white border border-stone-300 hover:border-[#0E8C74] text-[#0E8C74] text-xs font-extrabold cursor-pointer transition-colors"
                          >
                            {t('claimBtn')}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Surah Repetition Khatm */
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-stone-50 border border-stone-200 text-center">
                <span className="text-xs sm:text-sm font-bold text-[#0E8C74] uppercase tracking-wider">{t('targetSurahLabel')}</span>
                <h4 className="text-2xl sm:text-3xl font-black text-[#16241A] mt-2">
                  {currentTask.targetSurah}
                </h4>
                <p className="text-sm sm:text-base font-bold text-[#5D6B5A] mt-2">
                  {t('repetitionGoalLabel')}: {currentTask.repetitionGoal}
                </p>

                {/* Progress bar */}
                <div className="max-w-md mx-auto mt-5 space-y-2">
                  {(() => {
                    const completedTotal = currentTask.assignments
                      .filter((a) => a.status === 'completed')
                      .reduce((sum, a) => sum + (a.repetitionCount || 0), 0);
                    const repGoal = currentTask.repetitionGoal || 100;
                    const percent = Math.min(100, Math.round((completedTotal / repGoal) * 100));

                    return (
                      <>
                        <div className="flex justify-between text-sm font-extrabold text-stone-700">
                          <span>{completedTotal} {t('completedTasks')}</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-4 overflow-hidden">
                          <div
                            className="bg-[#0E8C74] h-full rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Claim Repetition Form */}
              <div className="max-w-sm mx-auto p-5 rounded-2xl border border-stone-200 bg-white space-y-3 shadow-xs">
                <h5 className="text-sm font-extrabold text-[#16241A]">{t('claimBtn')}</h5>
                <div className="flex gap-2.5">
                  <input
                    type="number"
                    min="1"
                    defaultValue={10}
                    id="repCountInput"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0E8C74]/30"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('repCountInput') as HTMLInputElement;
                      const val = Number(input?.value) || 10;
                      claimGroupTaskPortion(currentTask.id, undefined, val);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0E8C74] hover:bg-[#0b705d] text-white text-sm font-extrabold cursor-pointer transition-colors"
                  >
                    {t('claimBtn')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. EXTEND DEADLINE MODAL */}
      {extendingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-xl">
            <h4 className="text-lg font-bold text-[#16241A]">{t('extendDeadline')}</h4>
            <p className="text-xs sm:text-sm text-[#5D6B5A]">{t('targetDateLabel')}</p>
            <input
              type="date"
              value={newExtDate}
              onChange={(e) => setNewExtDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm font-bold outline-none"
            />
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setExtendingTaskId(null)}
                className="flex-1 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-sm font-bold cursor-pointer transition-colors"
              >
                {t('cancelBtn')}
              </button>
              <button
                onClick={() => {
                  if (newExtDate) {
                    extendGroupTaskDeadline(extendingTaskId, newExtDate);
                    setExtendingTaskId(null);
                  }
                }}
                className="flex-1 py-2.5 rounded-2xl bg-[#0E8C74] hover:bg-[#0b705d] text-white text-sm font-bold cursor-pointer transition-colors"
              >
                {t('saveSettingsBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CREATE KHATM TASK MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="text-xl font-extrabold text-[#16241A]">{t('createKhatm')}</h4>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-700 text-lg cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-sm font-semibold">
              <div>
                <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('khatmTitleLabel')}</label>
                <input
                  type="text"
                  placeholder={t('taskTitlePlaceholder')}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#0E8C74]/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('taskDescLabel')}</label>
                <textarea
                  rows={2}
                  placeholder={t('taskDescPlaceholder')}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#0E8C74]/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('khatmTypeLabel')}</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#0E8C74]/30 bg-white"
                >
                  <option value="para">{t('type30Juz')}</option>
                  <option value="surah_repetition">{t('typeSurahRepetition')}</option>
                </select>
              </div>

              {newType === 'surah_repetition' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('targetSurahLabel')}</label>
                    <input
                      type="text"
                      value={newTargetSurah}
                      onChange={(e) => setNewTargetSurah(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#0E8C74]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('repetitionGoalLabel')}</label>
                    <input
                      type="number"
                      min="1"
                      value={newRepetitionGoal}
                      onChange={(e) => setNewRepetitionGoal(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#0E8C74]/30"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('targetDateLabel')}</label>
                <input
                  type="date"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#0E8C74]/30"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-sm cursor-pointer transition-colors"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-[#0E8C74] hover:bg-[#0b705d] text-white font-extrabold text-sm cursor-pointer transition-colors"
                >
                  {t('createTaskSubmit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
