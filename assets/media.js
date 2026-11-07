/* ==========================================================================
   TRINAH'S SURPRISE — CONTENT CONFIG  (the only file you need to edit)
   --------------------------------------------------------------------------
   1. Copy photos into  assets/images/   and videos into  assets/videos/
   2. List them below. The ORDER of the list = the order on the website.
      • Remove a line to remove a photo/video.
      • Drag a line up/down to rearrange.
   3. Save, upload the folder again to your host. Done. No other code to touch.
   ========================================================================== */

window.TRINAH_CONFIG = {

  /* ---------- EXAM START (drives the countdown) ----------
     Format: "YYYY-MM-DDTHH:MM:SS+03:00"  (+03:00 = Uganda time, EAT).
     Monday 9 November 2026, 08:00 by default. Change the time to match her
     real first paper (e.g. "2026-11-09T09:00:00+03:00").                    */
  examStart: "2026-11-09T08:00:00+03:00",

  /* ---------- PHOTOS ----------
     src      : path to the image (required)
     caption  : short text under the photo (optional, "" for none)
     focus    : where to keep the crop centred, "x% y%" (optional).
                Use "50% 20%" to keep faces near the top from being cut off.
     fit      : "cover" (default, fills the card) or "contain" (shows the whole
                photo with a soft blurred background — good for wide photos).
     Tip: resize photos to ~1200px wide first so the page loads fast.        */
  photos: [
    { src: "assets/images/trinah-1.jpg", caption: "That smile, though ✨", focus: "50% 15%" },
    { src: "assets/images/trinah-2.jpg", caption: "Mini boss energy 😎", focus: "50% 35%" },
    // Add more like this:
    // { src: "assets/images/photo3.jpg", caption: "", focus: "50% 25%" },
  ],

  /* ---------- VIDEOS ----------
     src      : path to the video, MP4 (H.264) plays everywhere (required)
     poster   : thumbnail image (optional but recommended; if left out the
                first frame of the video is shown once it is the active card)
     caption  : short text (optional)
     Tip: keep each video under ~15–25 MB for quick loading on mobile data.   */
  videos: [
    // { src: "assets/videos/clip1.mp4", poster: "assets/images/clip1-thumb.jpg", caption: "Remember this? 😂" },
    // { src: "assets/videos/clip2.mp4", caption: "" },
  ]
};
