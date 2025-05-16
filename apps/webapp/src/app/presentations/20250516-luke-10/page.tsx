'use client';

import { PresentationContainer } from '@/modules/presentation/presentation-container';
import { PresentationControls } from '@/modules/presentation/presentation-controls';
import { Slide } from '@/modules/presentation/slide';
import type { Metadata } from 'next';
import { useEffect, useRef } from 'react';

// YouTube video player component with auto-play functionality
function YouTubeVideo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // This will run when the component mounts (when the slide becomes visible)
    const playVideo = () => {
      if (iframeRef.current) {
        // Add autoplay to the src to ensure it plays immediately
        const currentSrc = iframeRef.current.src;
        iframeRef.current.src = `${currentSrc}${currentSrc.includes('?') ? '&' : '?'}autoplay=1`;
      }
    };

    playVideo();

    return () => {
      // Clean up if needed when slide changes
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src.replace('autoplay=1', '');
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
      <iframe
        ref={iframeRef}
        className="w-full max-w-2xl aspect-video rounded-xl shadow-lg"
        src="https://www.youtube.com/embed/zGxT9mqPOzk"
        title="The Importance of Focus"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default function MakingADifferencePresentation() {
  // Using a fixed, predictable presentation key for this presentation
  const presentationKey = 'luke-10-making-difference';

  return (
    <>
      <PresentationContainer totalSlides={7} presentationKey={presentationKey}>
        <PresentationControls />

        {/* Title Slide */}
        <Slide
          index={1}
          className="text-center bg-gradient-to-b from-background to-slate-100 dark:from-background dark:to-slate-900"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h1 className="mb-6 sm:mb-10 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Making a<span className="text-blue-600 dark:text-blue-400"> Difference </span>🤲
            </h1>
            <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-r-lg text-xl sm:text-2xl italic">
              <p>The Parable of the Good Samaritan</p>
              <p>At the Home of Martha and Mary</p>
            </div>
            <p className="mt-6 sm:mt-8 text-lg sm:text-xl font-medium">Luke 10:25-42</p>
          </div>
        </Slide>

        {/* The Parable of the Good Samaritan Slide */}
        <Slide
          index={2}
          className="bg-gradient-to-br from-background to-slate-50 dark:from-background dark:to-slate-950/50"
        >
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6">
            <h2 className="mb-6 sm:mb-10 text-3xl sm:text-4xl font-semibold text-center">
              <span className="border-b-2 border-blue-500 pb-1">
                The Parable of the Good Samaritan 🤝
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-10">
              <div className="p-4 sm:p-6 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 shadow-md h-full">
                <h3 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-4 text-blue-700 dark:text-blue-400 flex items-center">
                  <span className="mr-2">❤️</span> Loving God & Neighbor
                </h3>
                <p className="text-base sm:text-lg md:text-xl">
                  v25-29: The expert in the law asked Jesus about inheriting eternal life. Jesus
                  pointed to loving God and loving our neighbor.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-lg bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 shadow-md h-full">
                <h3 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-4 text-red-700 dark:text-red-400 flex items-center">
                  <span className="mr-2">👀</span> Looking Good, Doing Nothing
                </h3>
                <p className="text-base sm:text-lg md:text-xl">
                  v30-32: The priest and Levite saw the injured man but passed by on the other side,
                  choosing religious appearance over compassionate action.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-lg bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 shadow-md h-full">
                <h3 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-4 text-green-700 dark:text-green-400 flex items-center">
                  <span className="mr-2">✅</span> The True Neighbor
                </h3>
                <p className="text-base sm:text-lg md:text-xl">
                  v33-37: The Samaritan had compassion and took action, showing what it truly means
                  to be a neighbor.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-10 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg max-w-4xl mx-auto">
              <div className="space-y-4 sm:space-y-6 text-xl sm:text-2xl font-serif text-gray-800 dark:text-gray-200">
                <p className="leading-relaxed text-center">
                  "Which of these three do you think was a neighbor to the man who fell into the
                  hands of robbers?"
                </p>
                <p className="leading-relaxed text-center">
                  The expert in the law replied, "The one who had mercy on him."
                </p>
                <p className="leading-relaxed text-center">Jesus told him, "Go and do likewise."</p>
              </div>
              <p className="text-center text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-4">
                — Luke 10:36-37
              </p>
            </div>
          </div>
        </Slide>

        {/* At the Home of Martha and Mary Slide */}
        <Slide
          index={3}
          className="bg-gradient-to-r from-background to-slate-50 dark:from-background dark:to-slate-950/50"
        >
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6">
            <h2 className="mb-6 sm:mb-10 text-3xl sm:text-4xl font-semibold text-center">
              <span className="border-b-2 border-blue-500 pb-1">
                At the Home of Martha and Mary 🏠
              </span>
            </h2>

            <div className="p-4 sm:p-6 md:p-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 shadow-md mb-6 sm:mb-10 max-w-4xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-medium mb-3 sm:mb-5 text-amber-700 dark:text-amber-400 flex items-center">
                <span className="mr-3">⚠️</span> The Distracted Host
              </h3>
              <p className="text-lg sm:text-xl md:text-2xl">
                Martha was distracted by all the preparations that had to be made, missing out on
                what was truly important.
              </p>
            </div>

            <div className="p-4 sm:p-6 md:p-10 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg max-w-4xl mx-auto">
              <div className="space-y-4 text-lg sm:text-xl md:text-2xl font-serif text-gray-800 dark:text-gray-200">
                <p className="leading-relaxed text-center">
                  "But Martha was distracted by all the preparations that had to be made..."
                </p>
              </div>
              <p className="text-center text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-4">
                — Luke 10:40
              </p>
            </div>
          </div>
        </Slide>

        {/* Video Slide */}
        <Slide
          index={4}
          className="bg-gradient-to-tl from-background to-slate-50 dark:from-background dark:to-slate-950/50"
        >
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6">
            <h2 className="mb-6 sm:mb-10 text-3xl sm:text-4xl font-semibold text-center">
              <span className="border-b-2 border-blue-500 pb-1">The Importance of Focus 🎯</span>
            </h2>

            <div className="max-w-4xl mx-auto mt-10">
              <YouTubeVideo />
            </div>
          </div>
        </Slide>

        {/* Jesus' Response Slide */}
        <Slide
          index={5}
          className="bg-gradient-to-br from-background to-slate-50 dark:from-background dark:to-slate-950/50"
        >
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6">
            <h2 className="mb-6 sm:mb-10 text-3xl sm:text-4xl font-semibold text-center">
              <span className="border-b-2 border-blue-500 pb-1">Jesus' Response 🗣️</span>
            </h2>

            <div className="p-4 sm:p-6 md:p-10 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg max-w-4xl mx-auto">
              <div className="space-y-4 text-lg sm:text-xl md:text-2xl font-serif text-gray-800 dark:text-gray-200">
                <p className="leading-relaxed text-center">
                  "Martha, Martha," the Lord answered, "you are worried and upset about many things,
                  but few things are needed—or indeed only one. Mary has chosen what is better, and
                  it will not be taken away from her."
                </p>
              </div>
              <p className="text-center text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-4">
                — Luke 10:41-42
              </p>
            </div>
          </div>
        </Slide>

        {/* Discussion Slide */}
        <Slide
          index={6}
          className="text-center bg-gradient-to-t from-background to-slate-50 dark:from-background dark:to-slate-950/50"
        >
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">
            <h2 className="mb-6 sm:mb-10 text-3xl sm:text-4xl font-semibold flex justify-center items-center">
              <span className="mr-3">💬</span> Discussion
            </h2>

            <div className="p-4 sm:p-6 md:p-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg max-w-4xl mx-auto">
              <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed">
                What are some{' '}
                <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                  doable ways
                </span>{' '}
                that we can make a difference to our neighbours as a cell? 🤔
              </p>
            </div>
          </div>
        </Slide>

        {/* Reflection Slide */}
        <Slide
          index={7}
          className="bg-gradient-to-bl from-background to-slate-50 dark:from-background dark:to-slate-950/50"
        >
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6">
            <h2 className="mb-6 sm:mb-10 text-3xl sm:text-4xl font-semibold text-center">
              <span className="border-b-2 border-blue-500 pb-1">Reflection 🙏</span>
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4 sm:mt-8 max-w-4xl mx-auto">
              <div className="p-4 sm:p-6 md:p-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 shadow-md">
                <p className="text-lg sm:text-xl md:text-2xl flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-3 sm:mr-4 mt-1">❓</span>
                  <span>
                    Who is one "neighbour" that you can make a difference to today? What can you do?
                  </span>
                </p>
              </div>

              <div className="p-4 sm:p-6 md:p-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500 shadow-md">
                <p className="text-lg sm:text-xl md:text-2xl flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-3 sm:mr-4 mt-1">❓</span>
                  <span>What is an important thing that you've been neglecting?</span>
                </p>
              </div>

              <div className="p-4 sm:p-6 md:p-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 shadow-md">
                <p className="text-lg sm:text-xl md:text-2xl flex items-start">
                  <span className="text-amber-600 dark:text-amber-400 mr-3 sm:mr-4 mt-1">❓</span>
                  <span>What is one distraction that you can set aside today?</span>
                </p>
              </div>
            </div>
          </div>
        </Slide>
      </PresentationContainer>
    </>
  );
}
