import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { PlannedBlock, IslamicPriority, PrayerName } from '../../types';
import {
  CalendarCheck,
  Plus,
  Flame,
  CheckCircle2,
  Trash2,
  Clock,
  CheckSquare,
  BarChart3,
  Sparkles,
} from 'lucide-react';

export const ProductivityModule: React.FC = () => {
  const {
    language,
    prayerTimes,
    plannedBlocks,
    addPlannedBlock,
    togglePlannedBlock,
    deletePlannedBlock,
    habits,
    toggleHabit,
    addHabit,
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    prayerLogs,
    readingLogs,
    sadaqahLogs,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  const [activeTab, setActiveTab] = useState<'planner' | 'habits' | 'todos' | 'review'>('planner');

  // Form states for new block
  const [newTitle, setNewTitle] = useState('');
  const [newAnchor, setNewAnchor] = useState<PrayerName>('Dhuhr');
  const [newOffset, setNewOffset] = useState<number>(15);
  const [newDuration, setNewDuration] = useState<number>(30);
  const [newPriority, setNewPriority] = useState<IslamicPriority>('wajib');

  // Habit form
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCat, setNewHabitCat] = useState<'spiritual' | 'general'>('spiritual');

  // Todo form
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<IslamicPriority>('fardh');
  const [newTodoCategory, setNewTodoCategory] = useState('Personal');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addPlannedBlock({
      title: newTitle.trim(),
      prayerAnchor: newAnchor,
      offsetMinutes: Number(newOffset),
      durationMinutes: Number(newDuration),
      priorityTag: newPriority,
      completed: false,
    });
    setNewTitle('');
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim(), newHabitCat);
    setNewHabitName('');
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    addTodo({
      title: newTodoTitle.trim(),
      priorityTag: newTodoPriority,
      dueDate: todayStr,
      completed: false,
      category: newTodoCategory,
    });
    setNewTodoTitle('');
  };

  // Review calculations
  const totalPrayerLogs = prayerLogs.length;
  const onTimePrayers = prayerLogs.filter((p) => p.status === 'on-time').length;
  const prayerConsistency = totalPrayerLogs > 0 ? Math.round((onTimePrayers / totalPrayerLogs) * 100) : 85;

  const totalPagesRead = readingLogs.reduce((sum, r) => sum + r.pagesRead, 0);
  const totalCharityGiven = sadaqahLogs.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      {/* 1. SUB-TABS */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
              activeTab === 'planner'
                ? 'bg-[#1D7A9C] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('productivityTitle')}
          </button>
          <button
            onClick={() => setActiveTab('habits')}
            className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
              activeTab === 'habits'
                ? 'bg-[#1D7A9C] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('habitsTitle')}
          </button>
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
              activeTab === 'todos'
                ? 'bg-[#1D7A9C] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('islamicPriorities')}
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
              activeTab === 'review'
                ? 'bg-[#1D7A9C] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('weeklyReview')}
          </button>
        </div>
      </div>

      {/* 2. TAB 1: PRAYER-ANCHORED DAY PLANNER */}
      {activeTab === 'planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main schedule timeline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('timeBlockedSchedule')}</h3>
                <span className="text-xs sm:text-sm text-stone-500 font-medium">{t('prayerViaAladhan')}</span>
              </div>

              {/* Prayer anchors timeline */}
              <div className="space-y-4">
                {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as PrayerName[]).map((prayer) => {
                  const prayerTime = prayerTimes ? prayerTimes[prayer] : '--:--';
                  const associatedTasks = plannedBlocks.filter((b) => b.prayerAnchor === prayer);

                  return (
                    <div key={prayer} className="border border-stone-200 rounded-2xl p-4 sm:p-5 bg-stone-50/70">
                      {/* Anchor Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-[#2E8B4F]" />
                          <span className="text-base sm:text-lg font-black text-[#0B2E1C]">{t(prayer)}</span>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#2E8B4F] bg-[#E1F2E7] px-3 py-1 rounded-lg tabular-nums border border-[#2E8B4F]/30">
                          {prayerTime}
                        </span>
                      </div>

                      {/* Associated Planned Tasks */}
                      <div className="space-y-2.5">
                        {associatedTasks.length === 0 ? (
                          <p className="text-xs sm:text-sm text-stone-500 italic py-1">No tasks scheduled around this prayer yet.</p>
                        ) : (
                          associatedTasks.map((task) => (
                            <div
                              key={task.id}
                              className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                                task.completed
                                  ? 'bg-stone-100 border-stone-200 line-through text-stone-400'
                                  : 'bg-white border-stone-200 text-[#16241A] hover:border-[#1D7A9C]/50 shadow-2xs'
                              }`}
                            >
                              <div className="flex items-center gap-3.5">
                                <button
                                  onClick={() => togglePlannedBlock(task.id)}
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center border cursor-pointer ${
                                    task.completed ? 'bg-[#1D7A9C] border-[#1D7A9C] text-white' : 'border-stone-300'
                                  }`}
                                >
                                  {task.completed && <CheckCircle2 className="w-4 h-4" />}
                                </button>
                                <div>
                                  <p className="text-sm sm:text-base font-bold">{task.title}</p>
                                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                                    {task.offsetMinutes >= 0 ? `+${task.offsetMinutes}m after` : `${task.offsetMinutes}m before`} · {task.durationMinutes} min session
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg ${
                                    task.priorityTag === 'fardh'
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                      : task.priorityTag === 'wajib'
                                      ? 'bg-sky-100 text-sky-900 border border-sky-300'
                                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                                  }`}
                                >
                                  {task.priorityTag}
                                </span>
                                <button
                                  onClick={() => deletePlannedBlock(task.id)}
                                  className="text-stone-300 hover:text-red-500 p-1.5 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Add block sidebar form */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs h-fit">
            <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#1D7A9C]" />
              <span>{t('addTask')}</span>
            </h4>

            <form onSubmit={handleAddBlock} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('taskTitleLabel')}</label>
                <input
                  type="text"
                  placeholder={t('taskPlaceholder')}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none focus:border-[#1D7A9C]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('prayerAnchorLabel')}</label>
                <select
                  value={newAnchor}
                  onChange={(e) => setNewAnchor(e.target.value as PrayerName)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none focus:border-[#1D7A9C]"
                >
                  <option value="Fajr">{t('Fajr')}</option>
                  <option value="Dhuhr">{t('Dhuhr')}</option>
                  <option value="Asr">{t('Asr')}</option>
                  <option value="Maghrib">{t('Maghrib')}</option>
                  <option value="Isha">{t('Isha')}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('offsetMinutesLabel')}</label>
                  <input
                    type="number"
                    value={newOffset}
                    onChange={(e) => setNewOffset(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                  />
                  <span className="text-xs text-stone-500 font-medium mt-1 block">+after, -before</span>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('durationMinutesLabel')}</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('priorityTagLabel')}</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as IslamicPriority)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none focus:border-[#1D7A9C]"
                >
                  <option value="fardh">{t('fardh')}</option>
                  <option value="wajib">{t('wajib')}</option>
                  <option value="nafl">{t('nafl')}</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#1D7A9C] hover:bg-[#15607a] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                {t('addTask')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. TAB 2: HABIT TRACKER */}
      {activeTab === 'habits' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('habitsTitle')}</h3>
                <p className="text-sm sm:text-base text-stone-600 font-medium">Spiritual routines and daily personal habits</p>
              </div>

              {/* Add habit inline */}
              <form onSubmit={handleAddHabit} className="flex items-center gap-2.5">
                <input
                  type="text"
                  placeholder="New habit name..."
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl border border-stone-200 text-sm font-semibold outline-none focus:border-[#0E8C74]"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#0E8C74] text-white text-sm font-bold hover:bg-[#0b705d] transition-colors cursor-pointer shadow-xs"
                >
                  + Add
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map((habit) => {
                const isDone = !!habit.logs[todayStr];
                return (
                  <div
                    key={habit.id}
                    className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/70 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                          isDone ? 'bg-[#0E8C74] text-white shadow-xs' : 'border-2 border-stone-300 bg-white'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div>
                        <p className="text-base font-bold text-[#16241A]">{habit.name}</p>
                        {habit.nameArabic && (
                          <p className="text-sm text-[#0E8C74] font-arabic font-semibold">{habit.nameArabic}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#9A7218] bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-300/80">
                      <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>{habit.streak} days</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 3: TODOS WITH ISLAMIC PRIORITY TAGS */}
      {activeTab === 'todos' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('islamicPriorities')} To-Do List</h3>
                <p className="text-sm sm:text-base text-stone-600 font-medium">Prioritize duties by Fardh, Wajib, and Nafl</p>
              </div>

              {/* Add Todo */}
              <form onSubmit={handleAddTodo} className="flex flex-wrap items-center gap-2.5">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl border border-stone-200 text-sm font-semibold outline-none"
                  required
                />
                <select
                  value={newTodoPriority}
                  onChange={(e) => setNewTodoPriority(e.target.value as IslamicPriority)}
                  className="px-3.5 py-2.5 rounded-2xl border border-stone-200 text-sm font-semibold outline-none"
                >
                  <option value="fardh">Fardh</option>
                  <option value="wajib">Wajib</option>
                  <option value="nafl">Nafl</option>
                </select>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#1D7A9C] text-white text-sm font-bold hover:bg-[#15607a] cursor-pointer shadow-xs"
                >
                  + Add
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-4 sm:p-4.5 rounded-2xl border flex items-center justify-between transition-colors ${
                    todo.completed ? 'bg-stone-50 border-stone-200 line-through text-stone-400' : 'bg-white border-stone-200 text-[#16241A]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border cursor-pointer ${
                        todo.completed ? 'bg-[#1D7A9C] border-[#1D7A9C] text-white' : 'border-stone-300'
                      }`}
                    >
                      {todo.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <p className="text-base font-bold text-[#16241A]">{todo.title}</p>
                      <p className="text-xs sm:text-sm text-stone-500 font-medium">Due: {todo.dueDate} · {todo.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-bold uppercase px-3 py-1 rounded-xl ${
                        todo.priorityTag === 'fardh'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : todo.priorityTag === 'wajib'
                          ? 'bg-sky-100 text-sky-900 border border-sky-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {todo.priorityTag}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-stone-300 hover:text-red-500 p-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 4: WEEKLY & MONTHLY REVIEW SUMMARY */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] mb-2 tracking-tight">{t('weeklyReview')}</h3>
            <p className="text-sm sm:text-base text-stone-600 font-medium mb-6">
              Holistic summary of your spiritual consistency, habits, reading, and charity
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 sm:p-6 rounded-3xl bg-[#E1F2E7]/50 border border-[#2E8B4F]/40 shadow-2xs">
                <span className="text-xs sm:text-sm font-bold text-[#2E8B4F] uppercase tracking-wider">Prayer Consistency</span>
                <p className="text-3xl sm:text-4xl font-black text-[#16241A] mt-2 tabular-nums">{prayerConsistency}%</p>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">{onTimePrayers} prayers on-time</p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF0D8]/50 border border-[#C89B2E]/40 shadow-2xs">
                <span className="text-xs sm:text-sm font-bold text-[#C89B2E] uppercase tracking-wider">Qur'an Recitation</span>
                <p className="text-3xl sm:text-4xl font-black text-[#16241A] mt-2 tabular-nums">{totalPagesRead}</p>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">Total pages read recorded</p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#DCF0F6]/50 border border-[#1D7A9C]/40 shadow-2xs">
                <span className="text-xs sm:text-sm font-bold text-[#1D7A9C] uppercase tracking-wider">Habit Adherence</span>
                <p className="text-3xl sm:text-4xl font-black text-[#16241A] mt-2 tabular-nums">82%</p>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">Average streak active</p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAE5D8]/50 border border-[#C1541F]/40 shadow-2xs">
                <span className="text-xs sm:text-sm font-bold text-[#C1541F] uppercase tracking-wider">Charity Logged</span>
                <p className="text-3xl sm:text-4xl font-black text-[#16241A] mt-2 tabular-nums">${totalCharityGiven}</p>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">Sadaqah fulfilled</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
