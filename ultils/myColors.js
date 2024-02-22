export const myColors = {
    primary: '#8358ad',
    primaryT: '#7744aa',
    primaryL: '#d4b8fc',
    primaryL2: '#ddc4ff',
    primaryL3: '#e2ccff',
    primaryL4: '#e5d4fc ', //50%
    primaryL5: '#eadefa', //30%
    primaryL6: '#F4EDFF', //30%

    // primary: '#32B768',
    //   primaryT: '#2aa85e',
    // primaryL: '#a7faa5',
    // primaryL2: '#d1f7d0',
    // primaryL3: '#e6fce6',
    // primaryL4: '#edfaed ', //50%
    // primaryL5: '#f7fcf7', //30%
    star: '#FFC700',
    orange: '#FF7A00',
    green: '#2aa85e',
    green2: '#00A86B',

    greenL: '#99EDCE',


    textL0: '#525252',
    textL: '#8F8F8F',
    textL2: '#9E9C9C',
    textL3: '#888888',
    textL4: '#797979',
    textL5: '#555555',
    textL6: "#6B6B6B",
    line: '#AFAFAF',
    divider: '#EAEAEA',
    text: '#000000',
    text2: '#1F2937',
    text3: '#242424',
    dot: '#D9D9D9',
    background: '#FFFFFF',
    offColor: '#9CA3AF',
    offColor2: "#B7B7B7",
    offColor3: '#F3F3F3',
    offColor4: '#F1F1F1',
    offColor5: '#F5F5F5',
    offColor6: '#F4F4F4',
    offColor7: '#E9E9E9',
    darkBlue: '#0066FF',




    ligBlue: '#66D1FF',
    ligRed: '#ff3333',
    purple: '#66A3FF',


    // textL2: '#4B5563',
    // textL3: '#828282',
    // text2: '#242323',
    // backgroundL: '#F6F6F6',
    // backgroundTrans: 'rgba(0,0,0,0.5)',
    blue: '#2C8DFF',
    red: '#EB4646',
    blue: '#2C8DFF',
    statusbarW: '#FFFFFF',
    statusbarG: '#32B768',
    lightGree: "#D1FAE5",
    black: 'black',
    black2: '#222222',
    border: '#BEC5D1',
    searchbar: '#E6E7E9'
}


const alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
const darkColors = [
    '#283618',
    '#1B4F72',
    '#FFC700',
    '#FF7A00',
    '#36454F',
    '#2E4053',
    '#EB4646',
    '#2980B9',
    '#7D6608',
    '#283618',
    '#1B4F72',
    '#FFC700',
    '#FF7A00',
    '#36454F',
    '#2E4053',
    '#EB4646',
    '#2980B9',
    '#7D6608',
    '#283618',
    '#1B4F72',
    '#FFC700',
    '#FF7A00',
    '#36454F',
    '#2E4053',
    '#EB4646',
    '#2980B9',
    '#7D6608',
];

export function getAvatarColor(name) {
    const alph = name.slice(0, 1).toLowerCase()
    const ind = alpha.findIndex(it => it == alph)
    if (ind != -1) {
        return darkColors[ind]
    }

    return darkColors[darkColors.length - 1]

}