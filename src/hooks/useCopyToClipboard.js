import { useState } from 'react'

function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState(null)

  const copy = async text => {
    if (!navigator?.clipboard) {
      return false;
    };

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
    } catch (error) {
      setCopiedText(null)
    }

    return null;
  }

  return [copiedText, copy]
};

export default useCopyToClipboard;
