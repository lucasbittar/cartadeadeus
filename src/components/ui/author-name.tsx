'use client';

import React from 'react';

interface AuthorNameProps {
  name: string;
  className?: string;
}

/**
 * Renders an author name, automatically linking any Instagram handles (@username)
 */
export function AuthorName({ name, className }: AuthorNameProps) {
  // Match @username patterns (Instagram usernames: letters, numbers, underscores, periods)
  const instagramRegex = /@([a-zA-Z0-9._]+)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = instagramRegex.exec(name)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(name.slice(lastIndex, match.index));
    }

    // Add the Instagram link
    const username = match[1];
    parts.push(
      <a
        key={match.index}
        href={`https://instagram.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        @{username}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (lastIndex < name.length) {
    parts.push(name.slice(lastIndex));
  }

  // If no matches found, just return the name
  if (parts.length === 0) {
    return <span className={className}>{name}</span>;
  }

  return <span className={className}>{parts}</span>;
}
