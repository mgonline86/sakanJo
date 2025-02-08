export const setItemsInLocalStorage = (key, value) => {
  if (!key || !value) {
    return console.error('Cannot store in LS');
  }

  const valueToStore =
    typeof value !== 'string' ? JSON.stringify(value) : value;
  localStorage.setItem(key, valueToStore);
};

export const getItemFromLocalStorage = (key) => {
  if (!key) {
    return console.error('Cannot get value from LS');
  }
  return localStorage.getItem(key);
};

export const removeItemFromLocalStorage = (key) => {
  if (!key) {
    return console.error('Cannot remove item from LS');
  }
  localStorage.removeItem(key);
};

/***Here is the code for converting "image source" (url) to "Base64".***/
export const toDataURL = (url) =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }),
    );

/***Here is code for converting "Base64" to javascript "File Object".***/
export function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/*** Creating "File Object" from "image source" ***/
export const imageUrlToFile = (url, fileName = 'imageName.jpg') =>
  toDataURL(url).then((dataUrl) => {
    const fileData = dataURLtoFile(dataUrl, fileName);
    return fileData;
  });

/*** Creating "File Object" from "pdf source" ***/
export const pdfUrlToFile = (url, fileName = 'document.pdf') =>
  toDataURL(url).then((dataUrl) => {
    const fileData = dataURLtoFile(dataUrl, fileName);
    return fileData;
  });

export const handleYassinArray = (data) => {
  if (!data) {
    return [];
  }

  let arr = [];
  try {
    // check if already array
    if (Array.isArray(data)) {
      return data;
    }

    // 1st try
    arr = JSON.parse(data);
    if (Array.isArray(arr)) {
      return arr;
    }

    // 2nd try
    arr = JSON.parse(arr);
    if (Array.isArray(arr)) {
      return arr;
    }

    return [];
  } catch {
    return [];
  }
};

export const handleYassinObject = (data, returnEntriesArray = false) => {
  if (!data) {
    return returnEntriesArray ? [] : {};
  }
  
  let obj = {};
  try {
    // check if already object
    if (typeof data === 'object' && !Array.isArray(data)) {
      return returnEntriesArray ? Object.entries(data) : data;
    }

    // 1st try
    obj = JSON.parse(data);
    if (typeof obj === 'object') {
      return returnEntriesArray ? Object.entries(obj) : obj;
    }

    // 2nd try
    obj = JSON.parse(obj);
    if (typeof obj === 'object') {
      return returnEntriesArray ? Object.entries(obj) : obj;
    }

    return returnEntriesArray ? [] : {};
  } catch {
    return returnEntriesArray ? [] : {};
  }
};
