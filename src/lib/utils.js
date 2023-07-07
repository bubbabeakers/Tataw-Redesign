export function formatCount(viewerCount) {
  if (viewerCount >= 1000000) {
    return `${viewerCount.toFixed(1)}M`;
  } else if (viewerCount >= 1000) {
    return `${(viewerCount / 1000).toFixed(1)}K`;
  }

  return viewerCount;
}

export function formatTime(totalSeconds) {
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor((totalSeconds / 60 / 60) % 24);

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
}

export function getStreamIcon(streamToFind, streams) {
  const stream = streams.find(stream => stream.displayName == streamToFind);
  return stream.profileImageUrl;
}

export function pushMax(array, maxLength, ...elements) {
  if (array.length + elements.length >= maxLength) {
    array.splice(0, elements.length);
  }

  array.push(...elements);
}