'use client';

import { useState } from 'react';

export function ProfilePortrait() {
  const [failed, setFailed] = useState(false);
  return <div className="profile-portrait" aria-label="Foto Ahmad Dika Styansah">
    <span className="portrait-initials" aria-hidden="true">AD</span>
    {!failed && <img src="/profile/ahmad-dika-styansah.jpg" alt="Ahmad Dika Styansah" onError={() => setFailed(true)}/>}
    <span className="portrait-index">RV / 23</span>
  </div>;
}
