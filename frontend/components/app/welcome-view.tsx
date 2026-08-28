import { CheckIcon, SpinnerIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/livekit/button';
import type { StackChild } from '@/hooks/useStackStatus';

// Human labels for the supervisor's child process names (see /api/status).
const CHILD_LABELS: Record<string, string> = {
  livekit: 'WebRTC server',
  llama: 'Language model',
  nemotron: 'Speech-to-text',
  whisper: 'Speech-to-text',
  kokoro: 'Text-to-speech',
  agent: 'Agent worker',
};

function StackStartupStatus({ services }: { services: StackChild[] }) {
  return (
    <div className="mt-6 w-64 text-left">
      <ul className="space-y-2">
        {services.map((child) => (
          <li key={child.name} className="text-foreground flex items-center gap-2 text-sm">
            {child.ready ? (
              <CheckIcon weight="bold" className="text-fg0 size-4" />
            ) : (
              <SpinnerIcon weight="bold" className="text-muted-foreground size-4 animate-spin" />
            )}
            <span className={child.ready ? '' : 'text-muted-foreground'}>
              {CHILD_LABELS[child.name] ?? child.name}
            </span>
            {!child.ready && child.detail && (
              <span className="text-muted-foreground ml-auto font-mono text-xs tabular-nums">
                {child.detail}
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground mt-4 text-xs leading-5">
        Starting services — the first run downloads model weights and can take a while.
      </p>
    </div>
  );
}

function WelcomeImage() {
  // GRIM-60: Grimlock's brand avatar, replacing the stock waveform glyph.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/grimlock.png" alt="Grimlock" className="mb-4 size-16 rounded-full object-cover" />
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
  stackReady: boolean;
  stackChildren: StackChild[];
  wakeWord: boolean;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  stackReady,
  stackChildren,
  wakeWord,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref}>
      <section className="bg-background flex flex-col items-center justify-center text-center">
        <WelcomeImage />

        <p className="text-foreground max-w-prose pt-1 leading-6 font-medium">Talk to Grimlock</p>

        {stackReady ? (
          <>
            <Button
              variant="primary"
              size="lg"
              onClick={onStartCall}
              className="mt-6 w-64 font-mono"
            >
              {startButtonText}
            </Button>
            {wakeWord && (
              <p className="text-muted-foreground mt-3 text-sm">
                Wake word is on — after connecting, say{' '}
                <span className="text-foreground font-medium">“Hey LiveKit”</span> to wake the
                assistant.
              </p>
            )}
          </>
        ) : (
          <StackStartupStatus services={stackChildren} />
        )}
      </section>

      <div className="fixed bottom-5 left-0 flex w-full items-center justify-center">
        <p className="text-muted-foreground max-w-prose pt-1 text-xs leading-5 font-normal text-pretty md:text-sm">
          Need help getting set up? Check out the{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.livekit.io/agents/start/voice-ai/"
            className="underline"
          >
            Voice AI quickstart
          </a>
          .
        </p>
      </div>
    </div>
  );
};
