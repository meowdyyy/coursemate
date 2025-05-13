import React, { useState } from 'react';
import './VideoHub.css';

function VideoHub() {
  const [searchQuery, setSearchQuery] = useState('');

  //Defining a static a list of videos with titles and URLs temporarily 
  const videos = [
    { 
      title: "Math - Calculus Basics", 
      channel: "Math World", 
      views: "1.2M views", 
      date: "1 week ago", 
      url: "https://www.youtube.com/watch?v=WsQQvHm4lSw" 
    },
    { 
      title: "Physics - Laws of Motion", 
      channel: "Physics Pro", 
      views: "3.4M views", 
      date: "2 weeks ago", 
      url: "https://www.youtube.com/watch?v=kKKM8Y-u7ds" 
    },
    { 
      title: "Chemistry - Atomic Structure", 
      channel: "Chemistry Lab", 
      views: "900K views", 
      date: "3 days ago", 
      url: "https://www.youtube.com/watch?v=4QblYo-XeoY" 
    },
    { 
      title: "Biology - Cell Theory", 
      channel: "Bio Central", 
      views: "500K views", 
      date: "5 days ago", 
      url: "https://www.youtube.com/watch?v=-mPReow5Sjg" 
    },
    { 
      title: "Math - Trigonometry Explained", 
      channel: "Math Zone", 
      views: "1M views", 
      date: "2 months ago", 
      url: "https://www.youtube.com/watch?v=fDjLmYlweUA" 
    },
    { 
      title: "Chemistry - Chemical Reactions", 
      channel: "Chemistry Lab", 
      views: "1.5M views", 
      date: "1 month ago", 
      url: "https://www.youtube.com/watch?v=Lvbm8horG1U" 
    },
    { 
      title: "Physics - Thermodynamics", 
      channel: "Physics Pro", 
      views: "2.1M views", 
      date: "3 weeks ago", 
      url: "https://www.youtube.com/results?search_query=thermodynamics+physics+class+11" 
    },
    { 
      title: "Math - Algebra Fundamentals", 
      channel: "Math World", 
      views: "700K views", 
      date: "4 months ago", 
      url: "https://www.youtube.com/watch?v=NybHckSEQBI&list=PLydZ2Hrp_gPRNN65mXBRMXbTkAnRuwOLF" 
    },
    { 
      title: "Physics - Quantum Mechanics Basics", 
      channel: "Physics Explained", 
      views: "2.5M views", 
      date: "2 days ago", 
      url: "https://www.youtube.com/watch?v=p7bzE1E5PMY" 
    },
    { 
      title: "Chemistry - Periodic Table Guide", 
      channel: "Chem Teach", 
      views: "3M views", 
      date: "1 week ago", 
      url: "https://www.youtube.com/watch?v=rz4Dd1I_fX0" 
    },
    { 
      title: "Math - Probability and Statistics", 
      channel: "Math World", 
      views: "1.1M views", 
      date: "3 months ago", 
      url: "https://www.youtube.com/watch?v=qNGDD_Rh8ps&list=PLU6SqdYcYsfJPF-4HphQQ8OceDtqhlSW8" 
    },
    { 
      title: "Physics - Relativity Explained", 
      channel: "Physics Central", 
      views: "900K views", 
      date: "6 days ago", 
      url: "https://www.youtube.com/watch?v=yuD34tEpRFw" 
    },
    { 
      title: "Chemistry - Acids and Bases", 
      channel: "Chem Corner", 
      views: "750K views", 
      date: "2 weeks ago", 
      url: "https://www.youtube.com/watch?v=vt8fB3MFzLk&t=240s" 
    },
  ];

  //Filter videos based on the search query 
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="video-hub">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button">Search</button>
      </div>
      <div className="video-grid">
        {filteredVideos.map((video, index) => (
          <div key={index} className="video-card">
            <div className="thumbnail"></div>
            <div className="video-info">
              <div className="details">
                <div className="title">
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    {video.title}
                  </a>
                </div>
                <div className="channel">{video.channel}</div>
                <div className="views-date">{video.views} • {video.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoHub;
