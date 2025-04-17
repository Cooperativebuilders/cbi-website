// src/components/DiscordWidget.js
import React from "react";

const DiscordWidget = () => {
  // Replace DISCORD_SERVER_ID with your actual server ID
  return (
    <iframe
      src="https://discord.com/widget?id=1355137205445591100&theme=dark"
      width="350"
      height="500"
      allowtransparency="true"
      frameborder="0"
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
    ></iframe>
  );
};

export default DiscordWidget;
