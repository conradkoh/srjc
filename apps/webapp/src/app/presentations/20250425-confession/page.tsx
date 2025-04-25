import { PresentationContainer } from '@/modules/presentation/presentation-container';
import { PresentationControls } from '@/modules/presentation/presentation-controls';
import { Slide } from '@/modules/presentation/slide';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confession | 25th April 2025',
  description: 'Cell Group sharing on Confession',
};

export default function ConfessionPresentation() {
  const presentationKey = 'confession-april-2025';

  return (
    <PresentationContainer totalSlides={7} presentationKey={presentationKey}>
      <PresentationControls />
      
      <Slide index={1} className="flex items-center justify-center flex-col text-center p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold mb-6">James 5:16</h2>
          <p className="text-xl">Therefore confess your sins to each other and pray for each other so that you may be healed.</p>
          
          <h2 className="text-2xl font-bold mt-10 mb-6">Romans 12:2</h2>
          <p className="text-xl">Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is—his good, pleasing and perfect will.</p>
        </div>
      </Slide>
      
      <Slide index={2} className="flex items-center justify-center flex-col text-center p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold mb-8">What is Sin?</h2>
          <div className="text-left space-y-4">
            <p className="text-xl font-semibold">266. hamartia</p>
            <p className="text-lg">Meaning: prop: missing the mark; hence: (a) guilt, sin, (b) a fault, failure (in an ethical sense), sinful deed.</p>
            <p className="text-lg mt-4">Word Origin: Derived from the Greek verb ἁμαρτάνω (hamartanō), meaning "to miss the mark" or "to err."</p>
          </div>
        </div>
      </Slide>
      
      <Slide index={3} className="flex items-center justify-center flex-col text-center p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold mb-8">What is Confession?</h2>
          <div className="text-left space-y-4">
            <p className="text-xl font-semibold">1843. exomologeó</p>
            <p className="text-lg">Meaning: (a) I consent fully, agree out and out, (b) I confess, admit, acknowledge (cf. the early Hellenistic sense of the middle: I acknowledge a debt), (c) I give thanks, praise.</p>
            <p className="text-lg mt-4">Usage: The verb "exomologeó" primarily means to confess or to acknowledge openly. It is used in the New Testament to describe the act of confessing sins, acknowledging God's works, or giving thanks. The term implies a public declaration or admission, often in the context of worship or repentance.</p>
          </div>
        </div>
      </Slide>
      
      <Slide index={4} className="flex items-center justify-center flex-col text-center p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold mb-8">Taking stock of both the good and the bad</h2>
          <ul className="text-left list-disc pl-6 space-y-4 text-xl">
            <li>Confession: We need to make an effort to become aware of our sin, and externalise it</li>
            <li>What about the good?</li>
          </ul>
        </div>
      </Slide>
      
      <Slide index={5} className="flex items-center justify-center flex-col text-center p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold mb-6">Romans 12:6-8</h2>
          <p className="text-lg">6 We have different gifts, according to the grace given to each of us. If your gift is prophesying, then prophesy in accordance with your faith; 7 if it is serving, then serve; if it is teaching, then teach; 8 if it is to encourage, then give encouragement; if it is giving, then give generously; if it is to lead, do it diligently; if it is to show mercy, do it cheerfully.</p>
        </div>
      </Slide>
      
      <Slide index={6} className="flex items-center justify-center flex-col text-center p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold mb-8">Both the good and the bad</h2>
          <p className="text-xl">We are called to be responsible for both our gifts as well as our shortcomings</p>
        </div>
      </Slide>
      
      <Slide index={7} className="flex items-center justify-center flex-col text-center p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold mb-8">Reflection</h2>
          <ul className="text-left list-disc pl-6 space-y-4 text-xl">
            <li>What are some things we struggle with repenting of?</li>
            <li>How can we become aware of our sins so we can repent of them?</li>
          </ul>
        </div>
      </Slide>
    </PresentationContainer>
  );
} 