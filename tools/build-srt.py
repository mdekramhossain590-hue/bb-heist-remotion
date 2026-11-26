#!/usr/bin/env python3
"""Build SRTs for the BB heist Remotion remake.

Long video: rescale the old Helio SRT (417.84s, 111 cues) onto the new slow
narration (578.77s) chunk by chunk. Old/new chunk durations measured with
ffprobe; 0.6s silence gaps between new chunks (per voice skill).
Shorts: sentence-level SRT from the shorts scripts, timing distributed by
word count across the new shorts audio durations.
Also emits scenes.json (chunk/image-segment/chapter timing) for Remotion.
"""
import json, re, os

BASE = "/home/hatch/workspace/youtube-inside-file/bb-heist"
REMAKE = "/home/hatch/workspace/youtube-inside-file/bb-heist-remake"
OUT = "/home/hatch/workspace/youtube-inside-file/bb-heist-remotion"
os.makedirs(f"{OUT}/srt", exist_ok=True)

OLD_DUR = [27.84, 26.688, 52.368, 62.496, 40.416, 54.072, 10.536, 45.768, 39.192, 46.848, 11.616]
NEW_DUR = [34.704, 38.208, 70.368, 93.048, 56.472, 70.2, 14.256, 63.216, 53.904, 61.224, 17.28]
GAP = 0.6
CHUNKS = ["01-hook", "02-ch1a", "03-ch1b", "04-ch2", "05-ch3", "06-ch4a",
          "07-ch4b", "08-ch5a", "09-ch5b", "10-ch6", "11-end"]

def cum(durs, gap=0.0):
    out, t = [0.0], 0.0
    for i, d in enumerate(durs):
        t += d
        if i < len(durs) - 1:
            t += gap
        out.append(t)
    return out

OLD_CUM = cum(OLD_DUR)
NEW_START = []
t = 0.0
for i, d in enumerate(NEW_DUR):
    NEW_START.append(t)
    t += d + (GAP if i < len(NEW_DUR) - 1 else 0.0)
NEW_CUM = NEW_START + [t]
print("old total", OLD_CUM[-1], "new total", NEW_CUM[-1])

def parse_srt(path):
    text = open(path, encoding="utf-8").read().strip()
    cues = []
    for block in re.split(r"\n\s*\n", text):
        lines = [l for l in block.strip().splitlines() if l.strip()]
        if len(lines) < 3:
            continue
        m = re.match(r"(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)", lines[1])
        if not m:
            continue
        s = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + int(m.group(3)) + int(m.group(4)) / 1000
        e = int(m.group(5)) * 3600 + int(m.group(6)) * 60 + int(m.group(7)) + int(m.group(8)) / 1000
        cues.append((s, e, "\n".join(lines[2:])))
    return cues

def fmt(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def chunk_of(t):
    for i in range(len(OLD_DUR)):
        if OLD_CUM[i] <= t < OLD_CUM[i + 1] or (i == len(OLD_DUR) - 1 and t <= OLD_CUM[i + 1]):
            return i
    return len(OLD_DUR) - 1

def rescale(t, i):
    ratio = NEW_DUR[i] / OLD_DUR[i]
    return NEW_START[i] + (t - OLD_CUM[i]) * ratio

cues = parse_srt(f"{BASE}/video-helio/bb-heist-long-helio.bn.srt")
print("old cues:", len(cues))
new_cues = []
for s, e, txt in cues:
    i = chunk_of(s)
    j = chunk_of(e - 0.001)
    ns, ne = rescale(s, i), rescale(e, j)
    ne = min(ne, NEW_CUM[i + 1])
    new_cues.append((ns, ne, txt))
new_cues.sort()
# sanity: monotonic, within total
for k in range(1, len(new_cues)):
    assert new_cues[k][0] >= new_cues[k - 1][0] - 0.001, f"overlap at cue {k}"
assert new_cues[-1][1] <= NEW_CUM[-1] + 0.01

with open(f"{OUT}/srt/bb-heist-long-remotion.bn.srt", "w", encoding="utf-8") as f:
    for n, (s, e, txt) in enumerate(new_cues, 1):
        f.write(f"{n}\n{fmt(s)} --> {fmt(e)}\n{txt}\n\n")
print("long SRT written:", len(new_cues), "cues, last end", fmt(new_cues[-1][1]))

# ---- Shorts SRTs: word-count proportional sentence timing ----------------
def shorts_srt(name, text, total, out_path):
    sents = [s.strip() for s in re.split(r"(?<=[।.])\s*", text.strip()) if s.strip()]
    words = [len(s.split()) for s in sents]
    tot = sum(words)
    cues2, t = [], 0.0
    for s, w in zip(sents, words):
        d = total * w / tot
        cues2.append((t, t + d, s))
        t += d
    with open(out_path, "w", encoding="utf-8") as f:
        for n, (s, e, txt) in enumerate(cues2, 1):
            f.write(f"{n}\n{fmt(s)} --> {fmt(e)}\n{txt}\n\n")
    print(name, "SRT:", len(cues2), "cues, total", round(total, 2))

s1 = open(f"{BASE}/scripts-helio/shorts-1.txt", encoding="utf-8").read().replace("Narrator:", "").strip()
s2 = open(f"{BASE}/scripts-helio/shorts-2.txt", encoding="utf-8").read().replace("Narrator:", "").strip()
shorts_srt("shorts-1", s1, 30.816, f"{OUT}/srt/bb-heist-shorts-1-remotion.bn.srt")
shorts_srt("shorts-2", s2, 26.664, f"{OUT}/srt/bb-heist-shorts-2-remotion.bn.srt")

# ---- scenes.json for Remotion --------------------------------------------
# image segments follow build-remake.py plan
EFF = [d + (GAP if i < len(NEW_DUR) - 1 else 0.0) for i, d in enumerate(NEW_DUR)]
segs = [
    ("01.jpg", EFF[0]),
    ("02.jpg", (EFF[1] + EFF[2]) / 2),
    ("03.jpg", (EFF[1] + EFF[2]) / 2),
    ("04.jpg", EFF[3] / 2),
    ("05.jpg", EFF[3] / 2),
    ("06.jpg", EFF[4]),
    ("07.jpg", (EFF[5] + EFF[6]) / 2),
    ("08.jpg", (EFF[5] + EFF[6]) / 2),
    ("09.jpg", (EFF[7] + EFF[8]) / 2),
    ("10.jpg", (EFF[7] + EFF[8]) / 2),
    ("11.jpg", EFF[9]),
    ("12.jpg", EFF[10]),
]
img_segs, t = [], 0.0
for img, d in segs:
    img_segs.append({"image": img, "start": round(t, 3), "dur": round(d, 3)})
    t += d
chapters = [
    {"start": NEW_START[0], "title": "হুক — এক রাতে ৯৫১ মিলিয়ন ডলার"},
    {"start": NEW_START[1], "title": "অধ্যায় ১ — এক বছরের প্রস্তুতি"},
    {"start": NEW_START[3], "title": "অধ্যায় ২ — সেই রাত"},
    {"start": NEW_START[4], "title": "অধ্যায় ৩ — দুই ভুল যা বাঁচাল"},
    {"start": NEW_START[5], "title": "অধ্যায় ৪ — টাকার পথ"},
    {"start": NEW_START[7], "title": "অধ্যায় ৫ — কে দায়ী?"},
    {"start": NEW_START[9], "title": "অধ্যায় ৬ — ৯ বছর পর"},
    {"start": NEW_START[10], "title": "শেষ প্রশ্ন"},
]
chunks = [{"name": c, "start": round(NEW_START[i], 3), "dur": NEW_DUR[i]} for i, c in enumerate(CHUNKS)]
data = {"fps": 30, "totalSec": round(NEW_CUM[-1], 3),
        "chunks": chunks, "imageSegments": img_segs, "chapters": chapters,
        "captions": [{"start": round(s, 3), "end": round(e, 3), "text": txt.replace("\n", " ")}
                     for s, e, txt in new_cues]}
json.dump(data, open(f"{OUT}/src/scenes.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("scenes.json written; image segments sum", round(sum(s["dur"] for s in img_segs), 3))
print("chapters:", [(c["title"], round(c["start"], 1)) for c in chapters])
