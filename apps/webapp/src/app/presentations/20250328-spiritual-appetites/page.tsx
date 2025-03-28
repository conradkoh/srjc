import { PresentationContainer } from '@/modules/presentation/presentation-container';
import { PresentationControls } from '@/modules/presentation/presentation-controls';
import { Slide } from '@/modules/presentation/slide';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Spiritual Appetites | 25th March 2025',
  description: 'Cell Group sharing on Spiritual Appetites',
};

export default function SpiritualAppetitesPresentation() {
  // Using a fixed, predictable presentation key for this presentation
  const presentationKey = 'spiritual-appetites';

  return (
    <>
      <PresentationContainer totalSlides={8} presentationKey={presentationKey}>
        <PresentationControls />

        {/* Title Slide */}
        <Slide
          index={1}
          className="text-center bg-gradient-to-b from-background to-slate-100 dark:from-background dark:to-slate-900"
        >
          <div className="max-w-5xl mx-auto">
            <h1 className="mb-10 text-6xl font-bold tracking-tight">
              What are you
              <span className="text-blue-600 dark:text-blue-400"> thirsting </span>
              for? 💧
            </h1>
            <div className="max-w-3xl mx-auto p-8 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-r-lg text-2xl italic">
              <p>Blessed are those who hunger and thirst for righteousness,</p>
              <p>for they will be filled. ✨</p>
            </div>
            <p className="mt-8 text-xl font-medium">Matthew 5:6</p>
          </div>
        </Slide>

        {/* Defining "Good" Slide */}
        <Slide
          index={2}
          className="bg-gradient-to-br from-background to-slate-50 dark:from-background dark:to-slate-950/50"
        >
          <div className="max-w-6xl w-full mx-auto px-4">
            <h2 className="mb-12 text-4xl font-semibold text-center">
              <span className="border-b-2 border-blue-500 pb-1">
                Defining what is "good" to you 🤔
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 shadow-md border border-blue-100 dark:border-blue-900 h-full">
                <h3 className="text-3xl font-medium mb-5 text-blue-700 dark:text-blue-300 flex items-center">
                  <span className="mr-3">⏱️</span> Time
                </h3>
                <p className="text-2xl">
                  If you didn't have to work, what would you regularly spend time on?
                </p>
              </div>

              <div className="p-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 shadow-md border border-blue-100 dark:border-blue-900 h-full">
                <h3 className="text-3xl font-medium mb-5 text-blue-700 dark:text-blue-300 flex items-center">
                  <span className="mr-3">💰</span> Money
                </h3>
                <p className="text-2xl">
                  If money was no restriction, and you've bought everything possible for yourself,
                  what would you do with the rest?
                </p>
              </div>
            </div>
          </div>
        </Slide>

        {/* Blindness of Hunger Slide */}
        <Slide
          index={3}
          className="bg-gradient-to-r from-background to-slate-50 dark:from-background dark:to-slate-950/50"
        >
          <div className="max-w-6xl w-full mx-auto px-4">
            <h2 className="mb-10 text-4xl font-semibold text-center">
              <span className="border-b-2 border-blue-500 pb-1">Blindness of hunger 👁️‍🗨️</span>
            </h2>

            <p className="mb-8 text-2xl text-center max-w-4xl mx-auto">
              Blindness is defined as the inability to see. Applying the metaphor to a real context,
              we often do not perceive because of:
            </p>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              <div className="p-6 rounded-lg bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-xl h-full">
                <span className="font-semibold text-red-700 dark:text-red-400 text-2xl flex items-center">
                  <span className="mr-2">🔍</span> 1. Lack of attention / distraction
                </span>
                <p className="mt-3 text-xl">We focus on shiny things that are not valuable</p>
              </div>

              <div className="p-6 rounded-lg bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 text-xl h-full">
                <span className="font-semibold text-amber-700 dark:text-amber-400 text-2xl flex items-center">
                  <span className="mr-2">😮</span> 2. Emotion
                </span>
                <p className="mt-3 text-xl">
                  We fixate on what triggered how we feel and discard valuable information
                </p>
              </div>

              <div className="p-6 rounded-lg bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500 text-xl h-full">
                <span className="font-semibold text-purple-700 dark:text-purple-400 text-2xl flex items-center">
                  <span className="mr-2">🔮</span> 3. Lack of foresight
                </span>
                <p className="mt-3 text-xl">
                  Focus on short term gains rather than long term goals
                </p>
              </div>
            </div>
          </div>
        </Slide>

        {/* Hunger is not bad Slide */}
        <Slide
          index={4}
          className="bg-gradient-to-bl from-background to-slate-50 dark:from-background dark:to-slate-950/50"
        >
          <div className="max-w-6xl w-full mx-auto px-4">
            <h2 className="mb-10 text-4xl font-bold text-center text-green-700 dark:text-green-400 flex justify-center items-center">
              <span className="mr-3">🌱</span> Hunger is not a bad thing
            </h2>

            <div className="p-6 bg-green-50 dark:bg-green-950/30 rounded-lg shadow-md mb-8 max-w-4xl mx-auto">
              <p className="text-2xl">
                Hunger is the sub-conscious driving force for action. It is also something that we
                cannot immediately control at any given moment, but is more a reflection of our
                state.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 shadow-md h-full">
                <p className="text-2xl flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-3">💡</span>
                  <span>
                    It <span className="font-bold">reveals useful information</span> to us
                  </span>
                </p>
              </div>
              <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 shadow-md h-full">
                <p className="text-2xl flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-3">🧭</span>
                  <span>
                    It <span className="font-bold">guides our actions</span> and cannot go unignored
                    indefinitely
                  </span>
                </p>
              </div>
            </div>

            <div className="p-8 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-500 shadow-md max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold mb-5 text-yellow-700 dark:text-yellow-400 flex items-center">
                <span className="mr-3">⚠️</span> Hunger blindness is characterized by:
              </h3>
              <ul className="space-y-4 text-xl pl-4">
                <li className="flex items-start">
                  <span className="text-yellow-600 dark:text-yellow-500 mr-3 text-2xl">•</span>
                  <span className="text-xl">
                    <span className="font-semibold">Regret:</span> You decided and later regret it
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 dark:text-yellow-500 mr-3 text-2xl">•</span>
                  <span className="text-xl">
                    <span className="font-semibold">Missing information:</span> Your regret came
                    when more information was revealed
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Slide>

        {/* Discussion Question Slide */}
        <Slide
          index={5}
          className="text-center bg-gradient-to-t from-background to-slate-50 dark:from-background dark:to-slate-950/50"
        >
          <div className="max-w-5xl mx-auto w-full px-4">
            <h2 className="mb-12 text-4xl font-semibold flex justify-center items-center">
              <span className="mr-3">💬</span> Discussion Question
            </h2>

            <div className="p-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg max-w-4xl mx-auto">
              <p className="text-3xl leading-relaxed">
                What is{' '}
                <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                  one hunger
                </span>{' '}
                that drives your thoughts and guides your actions that you think is unhealthy? 🤔
              </p>
            </div>
          </div>
        </Slide>

        {/* Psalm Slide */}
        <Slide
          index={6}
          className="text-center bg-gradient-to-r from-slate-50 to-background dark:from-slate-950/50 dark:to-background"
        >
          <div className="max-w-5xl mx-auto w-full px-4">
            <h2 className="mb-12 text-4xl font-semibold text-blue-700 dark:text-blue-400 flex justify-center items-center">
              <span className="mr-3">📜</span> Psalm 37:23-24
            </h2>

            <div className="p-14 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 shadow-lg max-w-4xl mx-auto">
              <div className="space-y-6 text-3xl italic text-slate-800 dark:text-slate-200">
                <p className="leading-relaxed">The steps of a man are established by the LORD,</p>
                <p className="leading-relaxed">And He delights in his way</p>
                <div className="h-0.5 w-24 bg-blue-400 mx-auto my-6" />
                <p className="leading-relaxed">When he falls, he will not be hurled headlong,</p>
                <p className="leading-relaxed">Because the LORD is the One who holds his hand ✋</p>
              </div>
            </div>
          </div>
        </Slide>

        {/* Wells Slide */}
        <Slide
          index={7}
          className="bg-gradient-to-bl from-background to-slate-50 dark:from-background dark:to-slate-950/50"
        >
          <div className="max-w-6xl w-full mx-auto px-4">
            <h2 className="mb-12 text-4xl font-semibold text-center">
              <span className="border-b-2 border-blue-500 pb-1">
                Drinking from the right "well" 🚰
              </span>
            </h2>

            <div className="space-y-8">
              <div className="p-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 shadow-md">
                <h3 className="text-2xl font-medium mb-4 text-blue-700 dark:text-blue-400 flex items-center">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2" />
                  <span className="mr-2">🧠</span> Faith vs Knowledge
                </h3>
                <p className="text-xl pl-6 border-l-2 border-blue-300 dark:border-blue-700">
                  Example: When we regret an action, do we think{' '}
                  <span className="text-red-600 dark:text-red-400">"if only I knew xxx" ❌</span> or
                  do we think{' '}
                  <span className="text-green-600 dark:text-green-400">
                    "I should have prayed about it" ✅
                  </span>
                  ?
                </p>
              </div>

              <div className="p-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 shadow-md">
                <h3 className="text-2xl font-medium mb-4 text-blue-700 dark:text-blue-400 flex items-center">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2" />
                  <span className="mr-2">💪</span> Strength vs Humility
                </h3>
                <p className="text-xl pl-6 border-l-2 border-blue-300 dark:border-blue-700">
                  Example: When facing challenges, do we think{' '}
                  <span className="text-red-600 dark:text-red-400">
                    "I'm so tired, I tried everything" ❌
                  </span>{' '}
                  or do we{' '}
                  <span className="text-green-600 dark:text-green-400">
                    pour our hearts out to God ✅
                  </span>{' '}
                  and ask for help?
                </p>
              </div>

              <div className="p-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 shadow-md">
                <h3 className="text-2xl font-medium mb-4 text-blue-700 dark:text-blue-400 flex items-center">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2" />
                  <span className="mr-2">🔄</span> Flesh vs Spirit
                </h3>
                <p className="text-xl pl-6 border-l-2 border-blue-300 dark:border-blue-700">
                  Example: Do we find peace in{' '}
                  <span className="text-red-600 dark:text-red-400">material things ❌</span> or in{' '}
                  <span className="text-green-600 dark:text-green-400">Spiritual things ✅</span>{' '}
                  like prayer and communion with God?
                </p>
              </div>
            </div>
          </div>
        </Slide>

        {/* Reflection Questions Slide */}
        <Slide
          index={8}
          className="bg-gradient-to-t from-background to-slate-50 dark:from-background dark:to-slate-950/50"
        >
          <div className="max-w-6xl w-full mx-auto px-4">
            <h2 className="mb-12 text-4xl font-semibold text-center">
              <span className="border-b-2 border-blue-500 pb-1">Reflection Questions 🪞</span>
            </h2>

            <div className="grid gap-8 max-w-5xl mx-auto">
              <div className="p-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border-l-4 border-indigo-500 shadow-md">
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0">
                    ❓
                  </span>
                  <h3 className="text-2xl font-medium">
                    What are the{' '}
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">hungers</span>{' '}
                    that occupy your mind and guide your actions?
                  </h3>
                </div>
              </div>

              <div className="p-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 shadow-md">
                <div className="flex items-start gap-3">
                  <span className="text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0">📖</span>
                  <h3 className="text-2xl font-medium">
                    Do you hunger for the{' '}
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      word of God
                    </span>{' '}
                    to the degree that you want to? If not, what is one commitment you can make to
                    go one step closer to your goal?
                  </h3>
                </div>
              </div>

              <div className="p-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 shadow-md">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0">
                    🌟
                  </span>
                  <h3 className="text-2xl font-medium">
                    Do you hunger and thirst for{' '}
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      righteousness
                    </span>
                    ?
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </Slide>
      </PresentationContainer>
    </>
  );
}
