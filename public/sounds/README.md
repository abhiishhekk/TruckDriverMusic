# Horn sounds go here

Put your three horn audio files in this folder with these exact names:

```
public/sounds/horn-1.mp3
public/sounds/horn-2.mp3
public/sounds/horn-3.mp3
```

mp3 is recommended for the widest browser support (wav/ogg also work —
if you use a different extension, update the `src` paths in
`src/data/horns.js` to match).

That's it — no other code changes needed. The three horn buttons on
the page automatically play whichever file is listed for them in
`src/data/horns.js`.
