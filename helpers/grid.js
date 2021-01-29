export const getInitialState = ()=>{
  const pads = [];
  const max = 10;
  for (let i=0; i<max; i++) {
    for (let j=0; j<max; j++) {
      let index = i*max+j;
      if (i === 0 || i === (max-1) || j === 0 || j === (max-1)) {
        if (i === 0 && j === 0 || i === (max-1) && j === 0 || i === 0 && j === (max-1) || i === (max-1) && j === (max-1)) {
          pads.push([index, null, null, null]);
        } else pads.push([index, true, 0, 'ctrl']);
      } else pads.push([index, true, 0, 'note']);
    }
  }
  return pads;
};

export const getPaletteState = (topRow)=>{
  const pads = [];
  const max = 10;
  let colorIndex = topRow * 8;
  for (let i=0; i<max; i++) {
    for (let j=0; j<max; j++) {
      let index = i*max+j;
      if (i === 0 || i === (max-1) || j === 0 || j === (max-1)) {
        if (i === 0 && j === 0 || i === (max-1) && j === 0 || i === 0 && j === (max-1) || i === (max-1) && j === (max-1)) {
          pads.push([index, null, null, null]);
        } else {
          pads.push([index, true, 0, 'ctrl']);
        }
      } else {
        pads.push([index, true, colorIndex++, 'note']);
      }
    }
  }
  return pads;
};
