import { useState, useRef, useEffect } from "react";

const EMOJI_CATEGORIES = {
  smileys: {
    icon: "😀",
    emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","😋","😛","😜","😝","🤑","🤗","🤭","🤫","🤔","🤐","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳"],
  },
  hearts: {
    icon: "❤️",
    emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","💕","💞","💓","💗","💖","💘","💝","💟","🫶","💌","💋","😻","💑","👫","👬","👭"],
  },
  gestures: {
    icon: "👋",
    emojis: ["👋","🤚","🖐️","✋","🖖","👌","🤌","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","🤲","🙏","✍️","💪","🦾"],
  },
  animals: {
    icon: "🐱",
    emojis: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅","🦉","🦇","🐺","🐴","🦄","🐝","🦋","🐌","🐞","🐢","🦎","🐍","🦕","🦖","🦑","🐙","🦀","🐡","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🐘","🦛","🦏"],
  },
  food: {
    icon: "🍕",
    emojis: ["🍕","🍔","🍟","🌭","🌮","🌯","🥙","🥗","🍣","🍱","🍛","🍜","🍝","🍲","🍢","🍡","🍧","🍨","🍦","🧁","🎂","🍰","🍫","🍬","🍭","🍮","🍯","☕","🍵","🧃","🥤","🧋","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧉","🍾"],
  },
  symbols: {
    icon: "✨",
    emojis: ["✨","⭐","🌟","💫","⚡","🔥","💥","❄️","🌈","☀️","🌙","⛅","🌊","🌺","🌸","🌼","🌻","🍀","🎉","🎊","🎁","🎈","🏆","🥇","💎","🔮","🪄","🎯","🎲","🎮","🎵","🎶","🎸","🎹","🎤","🎧","📱","💻","⌚","📷"],
  },
};

export default function EmojiPicker({ onEmojiSelect }) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("smileys");
  const pickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
  };

  return (
    <div style={{ position: "relative" }} ref={pickerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        title="Emoji picker"
        style={{
          background: "none",
          border: "none",
          fontSize: "22px",
          cursor: "pointer",
          padding: "4px 6px",
          borderRadius: "6px",
          lineHeight: 1,
          transition: "background 0.15s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#f3f4f6")}
        onMouseOut={(e) => (e.currentTarget.style.background = "none")}
      >
        😊
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "44px",
            left: "0",
            width: "300px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {/* Category Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #e5e7eb",
              padding: "6px 8px",
              gap: "4px",
              overflowX: "auto",
            }}
          >
            {Object.entries(EMOJI_CATEGORIES).map(([key, { icon }]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                title={key}
                style={{
                  fontSize: "18px",
                  background: activeCategory === key ? "#eff6ff" : "none",
                  border: activeCategory === key ? "1px solid #bfdbfe" : "1px solid transparent",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  transition: "background 0.1s",
                  flexShrink: 0,
                }}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: "2px",
              padding: "8px",
              maxHeight: "180px",
              overflowY: "auto",
            }}
          >
            {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, i) => (
              <button
                key={i}
                onClick={() => handleEmojiClick(emoji)}
                style={{
                  fontSize: "20px",
                  background: "none",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px",
                  cursor: "pointer",
                  transition: "background 0.1s",
                  lineHeight: 1,
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                onMouseOut={(e) => (e.currentTarget.style.background = "none")}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
