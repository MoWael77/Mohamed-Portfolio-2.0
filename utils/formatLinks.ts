/**
 * Formats a given text string by replacing specific known URLs with clickable anchor tags.
 * It also handles newline characters by inserting <br/> tags.
 * @param text The input string to format.
 * @returns A JSX.Element containing the formatted text with clickable links.
 */
export const formatOutputWithLinks = (text: string): JSX.Element => {
  const parts: (string | JSX.Element)[] = []
  const replacements = [
    { text: "linkedin.com/in/mohamedwael7", url: "https://linkedin.com/in/mohamedwael7" },
    { text: "github.com/MoWael77", url: "https://github.com/MoWael77" },
    { text: "mohamedwael.me", url: "https://mohamedwael.me" },
  ]

  // Sort replacements by length descending to ensure longer, more specific matches are processed first.
  // This prevents issues where "github.com" might be matched before "github.com/MoWael77".
  replacements.sort((a, b) => b.text.length - a.text.length)

  let currentText = text

  // First, replace the actual link texts with a unique placeholder that includes the URL and original text.
  // This prevents issues with regex and allows for easy extraction later.
  replacements.forEach((rep) => {
    // Escape special characters in the replacement text for RegExp constructor
    const escapedText = rep.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(escapedText, "g")
    currentText = currentText.replace(regex, `[[LINK::${rep.url}::${rep.text}]]`)
  })

  // Now, split the modified text by the custom placeholder and process each segment.
  currentText.split(/(\[\[LINK::.*?::.*?\]\])/g).forEach((segment, index) => {
    const match = segment.match(/\[\[LINK::(.*?)::(.*?)\]\]/)
    if (match) {
      // If it's a link placeholder, create an <a> tag.
      const url = match[1]
      const linkText = match[2]
      parts.push(
        <a
          key={`link-${index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
        >
          {linkText}
        </a>,
      )
    } else {
      // If it's plain text, split by newlines and add <br/> tags.
      segment.split("\n").forEach((line, j) => {
        parts.push(line)
        if (j < segment.split("\n").length - 1) {
          parts.push(<br key={`br-${index}-${j}`} />)
        }
      })
    }
  })

  return <>{parts}</>
}
