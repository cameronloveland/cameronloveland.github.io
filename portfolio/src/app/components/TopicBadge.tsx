import React from 'react';
import { getTopicIcon } from '../lib/getTopicIcon';

export default function TopicBadge({ topic }: { topic: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border border-neutral-700 bg-neutral-800 text-white">
      {getTopicIcon(topic)}
      <span>{topic}</span>
    </span>
  );
}
