import type {ReactNode} from 'react';
import {AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import captions from './data/captions.json';
import plan from './data/video-plan.json';
import style from './data/style-profile.json';

const font = 'PingFang SC,Microsoft YaHei,Noto Sans CJK SC,sans-serif';
const y = (range: number[]) => Math.round(style.height * range[0]);
const h = (range: number[]) => Math.round(style.height * (range[1] - range[0]));
const frameMs = (frame: number, fps: number) => (frame / fps) * 1000;
const currentScene = (ms: number) => (plan.scenes as any[]).find((scene) => ms >= scene.startMs && ms < scene.endMs) || plan.scenes[0];

const SlashRule = ({top, color}: {top: number; color: string}) => <div style={{position: 'absolute', top, left: 58, right: 58, display: 'flex', gap: 15}}>{Array.from({length: 24}, (_, index) => <i key={index} style={{width: 27, height: 6, background: color, transform: 'skewX(-32deg)', opacity: 0.42 + (index % 3) * 0.16}} />)}</div>;
export const TopSlashDivider = () => <SlashRule top={y(style.layout.topSlashes)} color={style.textPrimary} />;
export const BottomSlashDivider = () => <SlashRule top={y(style.layout.bottomSlashes)} color={style.textPrimary} />;

export const BackgroundImageStage = () => {
  const frame = useCurrentFrame(); const {durationInFrames} = useVideoConfig();
  const scale = 1 + interpolate(frame, [0, durationInFrames], [0, 0.025]);
  const media = (style as any).mediaImage || {}; const brightness = media.fullBackgroundBrightness ?? .72; const saturation = media.fullBackgroundSaturation ?? .9;
  const fullStage = {position: 'absolute' as const, top: 0, left: 0, width: 1080, height: 1920, objectFit: 'cover' as const};
  const readabilityOverlay = 'linear-gradient(to bottom,rgba(17,17,17,.08) 0%,rgba(17,17,17,.18) 36%,rgba(17,17,17,.34) 63%,rgba(17,17,17,.58) 100%),linear-gradient(to right,rgba(17,17,17,.32) 0%,transparent 24%,transparent 76%,rgba(17,17,17,.32) 100%)';
  return <><Img src={staticFile('background')} style={{...fullStage, transform: `scale(${scale})`, filter: `brightness(${brightness}) saturate(${saturation})`, opacity: 1}} /><div style={{...fullStage, backgroundImage: readabilityOverlay, pointerEvents: 'none'}} /></>;
};

const AnimatedAsset = ({path, id, side, localFrame}: {path: string; id: string; side: 'left' | 'right'; localFrame: number}) => {
  const {fps} = useVideoConfig(); const phase = side === 'left' ? 0 : 1.8; const rawEntry = spring({fps, frame: Math.max(0, localFrame - (side === 'left' ? 0 : 8)), config: {damping: 12, stiffness: 130}}); const entry = interpolate(rawEntry, [0, 1], [.72, 1]);
  const isNarrator = id.startsWith('woman-'); const isMascot = id.startsWith('cat-'); const isCharacter = isNarrator || isMascot; const zoom = 1.2; const baseWidth = side === 'left' ? 176 : 212; const width = isCharacter ? 182 : baseWidth * zoom;
  // The transparent margins in the two supplied character series differ. Size
  // the visible content, not the exported PNG canvas, so both sides read equal.
  const height = isMascot ? 244 : isNarrator ? 228 : baseWidth * zoom; const characterCenters = (style.layout as any).animationSideCenters || [150, 930]; const characterCenterX = side === 'left' ? characterCenters[0] : characterCenters[1]; const left = isCharacter ? characterCenterX - width / 2 : side === 'left' ? 94 : 728; const bob = Math.sin(localFrame / (isCharacter ? 13 : 10) + phase) * (isCharacter ? -4 : -9);
  const shake = id === 'fluent-phone' || id === 'fluent-megaphone' ? Math.sin(localFrame * .72) * 10 : id === 'woman-warning' || id === 'cat-warning' ? Math.sin(localFrame * .42) * 3.5 : id === 'woman-pointing' ? Math.sin(localFrame * .28) * 2.5 : 0;
  const swing = id === 'woman-questioning-vector' || id === 'cat-thinking' ? Math.sin(localFrame / 18) * 3.6 : id === 'woman-news-anchor' || id === 'cat-news-anchor' ? Math.sin(localFrame / 28) * 1.4 : id === 'woman-explaining' ? Math.sin(localFrame / 20) * 2.2 : id === 'woman-pointing' ? Math.sin(localFrame / 15) * 2.8 : id === 'woman-warning' || id === 'cat-warning' ? Math.sin(localFrame / 16) * 2 : id === 'woman-phone-reading' || id === 'cat-phone-reading' ? Math.sin(localFrame / 22) * 1.6 : id === 'woman-reading-notes' ? Math.sin(localFrame / 24) * 1.5 : id === 'woman-thumbs-up' ? Math.sin(localFrame / 16) * 2.3 : id === 'woman-coffee-pause' ? Math.sin(localFrame / 30) * 1.2 : id === 'fluent-hammer' ? Math.sin(localFrame / 8) * 12 : id === 'fluent-balance' ? Math.sin(localFrame / 20) * 6 : id === 'fluent-no-entry' ? Math.sin(localFrame / 12) * 4 : Math.sin(localFrame / 30 + phase) * 2;
  const pulse = id === 'fluent-warning' || id === 'fluent-lightbulb' || id === 'woman-thumbs-up' || id === 'cat-warning' ? 1 + Math.sin(localFrame / 7) * .075 : id === 'woman-news-anchor' || id === 'cat-news-anchor' ? 1 + Math.sin(localFrame / 22) * .015 : 1 + Math.sin(localFrame / 18 + phase) * .03;
  const x = interpolate(entry, [0, 1], [side === 'left' ? -90 : 90, 0]) + shake;
  return <Img src={staticFile(`animation-library/${path}`)} style={{position: 'absolute', width, height, left, top: isMascot ? 4 : isNarrator ? 0 : side === 'left' ? 43 : -1, objectFit: 'contain', transform: `translateX(${x}px) translateY(${bob + (1 - entry) * 22}px) rotate(${swing}deg) scale(${entry * pulse})`, opacity: entry, filter: 'drop-shadow(0 14px 18px rgba(0,0,0,.42))'}} />;
};
export const CharacterAnimationStage = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const scene = currentScene(frameMs(frame, fps)); const localFrame = frame - Math.round(scene.startMs / 1000 * fps);
  const animationRegion = (style.layout as any).animationStage || style.layout.title; const top = y(animationRegion) + Math.round((h(animationRegion) - 248) / 2);
  const fallbackNarrator = (style as any).narrator || {assetId: 'woman-questioning-vector', assetPath: 'characters/woman-questioning-vector.png'}; const narrator = scene.companionAnimationAssetId?.startsWith('woman-') ? {assetId: scene.companionAnimationAssetId, assetPath: scene.companionAnimationAssetPath} : fallbackNarrator; const questionFloat = Math.sin(localFrame / 13) * 12;
  return <div style={{position: 'absolute', top, left: 0, width: 1080, height: 248}}><AnimatedAsset path={narrator.assetPath} id={narrator.assetId} side="left" localFrame={localFrame} />{narrator.assetId === 'woman-questioning-vector' && <><span style={{position: 'absolute', left: 226, top: 16 + questionFloat, color: '#A78BFA', fontFamily: font, fontSize: 32, fontWeight: 900, textShadow: '0 6px 18px rgba(155,92,255,.52)'}}>?</span><span style={{position: 'absolute', left: 254, top: 48 - questionFloat * .55, color: '#48C6EF', fontFamily: font, fontSize: 22, fontWeight: 900, opacity: .86}}>?</span></>}<AnimatedAsset path={scene.animationAssetPath || 'fluent/thinking-face.png'} id={scene.animationAssetId || 'fluent-thinking-face'} side="right" localFrame={localFrame} /></div>;
};

export const TitleText = () => {
  const lines = (plan as any).titleLines || plan.scenes[0]?.titleLines || []; const colors = (plan as any).titleColors || [style.activePurple, '#48C6EF'];
  const renderLine = (line: string, lineIndex: number) => {const focusStart = Math.max(0, line.length - 2); return <div key={`${line}-${lineIndex}`} style={{height: lineIndex === 0 ? 106 : 132, whiteSpace: 'nowrap'}}>{Array.from(line).map((character, index) => {const focused = index >= focusStart; const distance = Math.abs(index - (line.length - 1) / 2); return <span key={`${character}-${index}`} style={{display: 'inline-block', color: focused ? (lineIndex === 0 ? style.activePurple : '#48C6EF') : style.textPrimary, fontSize: focused ? (lineIndex === 0 ? 126 : 142) : (lineIndex === 0 ? 88 : 104), transform: `translateY(${-distance * distance * 2 + (focused ? -9 : 4)}px) rotate(${(index - (line.length - 1) / 2) * 1.35}deg) skewX(-5deg)`, marginRight: -4, textShadow: focused ? '0 8px 22px rgba(126,83,255,.38)' : '0 5px 18px rgba(0,0,0,.4)'}}>{character}</span>})}</div>};
  const titleHeight = 238; const top = y(style.layout.title) + Math.max(0, Math.round((h(style.layout.title) - titleHeight) / 2));
  return <div style={{position: 'absolute', top, left: 64, right: 64, fontFamily: font, fontWeight: 900, lineHeight: 1, letterSpacing: -5, textAlign: 'center', transform: 'rotate(-1.3deg)'}}>{lines.map(renderLine)}</div>;
};

const TranscriptRail = () => {const top = y(style.layout.transcript) + 20; const height = h(style.layout.transcript) - 40; const activeTop = h(style.layout.transcript) / 2 - 20 - 11; return <div style={{position: 'absolute', top, left: 120, height, width: 52, borderLeft: '3px solid rgba(244,241,236,.42)'}}>{Array.from({length: 7}, (_, index) => <i key={index} style={{position: 'absolute', left: -8, top: 18 + index * 72, width: 14, height: 14, borderRadius: '50%', background: style.textMuted, border: '2px solid #111111'}} />)}<i style={{position: 'absolute', left: -12, top: activeTop, width: 22, height: 22, borderRadius: '50%', background: style.activePurple, border: '4px solid #E9D9FF', boxShadow: '0 0 16px #9B5CFF'}} /></div>};
export const ScrollingTranscript = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const ms = frameMs(frame, fps); const all = captions as any[];
  const found = all.findIndex((caption) => ms >= caption.startMs && ms <= caption.endMs); const active = found < 0 ? all.reduce((last: number, caption: any, index: number) => caption.startMs <= ms ? index : last, 0) : found;
  const row = 86; const top = y(style.layout.transcript); const height = h(style.layout.transcript); const maxCharactersPerLine = 20; const lineHeight = style.transcriptFontSize * 1.38; const itemHeights = all.map((caption) => Math.max(row, Math.ceil(Array.from(caption.text).length / maxCharactersPerLine) * lineHeight + 12)); const offsets: number[] = []; let cursor = 0; for (const itemHeight of itemHeights) {offsets.push(cursor); cursor += itemHeight;}
  const centerFor = (index: number) => offsets[index] + itemHeights[index] / 2; const transitionStart = active === 0 ? 0 : all[active].startMs; const progress = interpolate(ms, [transitionStart, transitionStart + 220], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); const visualCenter = active === 0 ? centerFor(0) : interpolate(progress, [0, 1], [centerFor(active - 1), centerFor(active)]);
  return <><TranscriptRail /><div style={{position: 'absolute', top, left: 205, right: 82, height, overflow: 'hidden', fontFamily: font, fontSize: style.transcriptFontSize, lineHeight: 1.38}}><div style={{transform: `translateY(${height / 2 - visualCenter}px)`}}>{all.map((caption, index) => <div key={caption.id} style={{boxSizing: 'border-box', height: itemHeights[index], display: 'flex', alignItems: 'center', color: style.textPrimary, opacity: index < active ? .34 : 1, fontWeight: index === active ? style.activeSentenceFontWeight : 500, padding: '6px 16px', borderRadius: 4, background: index === active ? `linear-gradient(90deg,${style.activePurple},rgba(155,92,255,.76),transparent)` : 'transparent'}}>{caption.text}</div>)}</div></div></>;
};

export const ActiveSentenceHighlight = () => null;
export const PersonalFooter = () => <div style={{position: 'absolute', top: y(style.layout.footer) + 8, left: 72, right: 72, fontFamily: font, textAlign: 'center'}}><div style={{color: style.accentWarm, fontSize: 30, fontWeight: 700}}>{style.footerTitle}</div><div style={{color: style.textMuted, fontSize: 22, marginTop: 13}}>{style.footerDisclaimer}</div></div>;
export const FilmGrainOverlay = () => <div style={{position: 'absolute', inset: 0, opacity: .08, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(255,255,255,.35) .7px,transparent .7px)', backgroundSize: '5px 5px'}} />;
export const SafeArea = ({children}: {children: ReactNode}) => <>{children}</>;
export const VideoComposition = () => <AbsoluteFill style={{background: style.background, overflow: 'hidden'}}><Audio src={staticFile('voiceover.wav')} /><SafeArea><BackgroundImageStage /><CharacterAnimationStage /><TopSlashDivider /><TitleText /><ScrollingTranscript /><BottomSlashDivider /><PersonalFooter /></SafeArea><FilmGrainOverlay /></AbsoluteFill>;
