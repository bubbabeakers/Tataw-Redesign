export function formatViewerCount(viewCount) {
  if (viewCount >= 1000000) {
    return `${(viewCount / 1000000).toFixed(1)}M`;
  } else if (viewCount >= 1000) {
    return `${(viewCount / 1000).toFixed(1)}K`;
  }

  return viewCount;
}

export function getStreamIcon(streamToFind, streams) {
  const stream = streams.find(stream => stream.displayName == streamToFind);
  return stream.profileImageUrl;
}

export function pushMax(array, maxLength, ...elements) {
  if (elements.length > maxLength) {
    elements.splice(maxLength);
  }
  
  if (array.length === maxLength) {
    array.splice(0, elements.length);
  }

  array.push(...elements);
}