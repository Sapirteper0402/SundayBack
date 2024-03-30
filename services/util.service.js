function makeId(length = 5) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

// function getRandomColor() {
//   let letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRandomName() {
  const names = [
    'Jhon',
    'Wick',
    'Strong',
    'Dude',
    'Yep',
    'Hello',
    'World',
    'Power',
    'Goku',
    'Super',
    'Hi',
    'You',
    'Are',
    'Awesome',
  ]
  const famName = [
    'star',
    'kamikaza',
    'family',
    'eat',
    'some',
    'banana',
    'brock',
    'david',
    'gun',
    'walk',
    'talk',
    'car',
    'wing',
    'yang',
    'snow',
    'fire'
  ]
  return (
    names[Math.floor(Math.random() * names.length)] +
    famName[Math.floor(Math.random() * names.length)]
  )
}

function generateRandomImg() {
  //try to get diff img every time
  return 'pro' + Math.floor(Math.random() * 17 + 1) + '.png'
}

function timeAgo(ms = new Date()) {
  const date = ms instanceof Date ? ms : new Date(ms)
  const formatter = new Intl.RelativeTimeFormat('en')
  const ranges = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  }
  
  const secondsElapsed = (date.getTime() - Date.now()) / 1000
  for (let key in ranges) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key]
      let time = formatter.format(Math.round(delta), key)
      if (time.includes('in')) {
        time = time.replace('in ', '')
        time = time.replace('ago', '')
        time += ' ago'
      }
      return time //? time : 'Just now'
    }
  }
}


function randomPastTime() {
  const HOUR = 1000 * 60 * 60
  const DAY = 1000 * 60 * 60 * 24
  const WEEK = 1000 * 60 * 60 * 24 * 7

  const pastTime = getRandomIntInclusive(HOUR, WEEK)
  return Date.now() - pastTime
}

function bringColor() {
  const rgbColors = [
      "rgb(23, 90, 99)",
      "rgb(3, 127, 76)",
      "rgb(0, 200, 117)",
      "rgb(156, 211, 38)",
      "rgb(202, 182, 65)",
      "rgb(255, 203, 0)",
      "rgb(120, 75, 209)",
      "rgb(157, 80, 221)",
      "rgb(0, 126, 181)",
      "rgb(87, 155, 252)",
      "rgb(102, 204, 255)",
      "rgb(187, 51, 84)",
      "rgb(223, 47, 74)",
      "rgb(255, 0, 127)",
      "rgb(255, 90, 196)",
      "rgb(255, 100, 46)",
      "rgb(253, 171, 61)",
      "rgb(127, 83, 71)",
      "rgb(196, 196, 196)",
      "rgb(117, 117, 117)"
    ]

    return rgbColors
}


function getRandomColor() {
  const rgbColors = bringColor(); 
  const randomIndex = Math.floor(Math.random() * rgbColors.length);
  return rgbColors[randomIndex]; 
}

export const utilService = {
  makeId,
  getRandomInt,
  debounce,
  generateRandomName,
  timeAgo,
  generateRandomImg,
  randomPastTime,
  getRandomColor
}
