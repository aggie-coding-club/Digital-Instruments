const InstrumentLibrary = {
    currentInstrument: {
        title: "None",
        img: "https://th.bing.com/th/id/OIP.Cy7-Xf2U_h5Eqrdodq-3iAHaHa?pid=ImgDet&rs=1",
        description: "This plays notes like an instrument",
        instrumentSound: {
          overtoneRelativeAmplitudes: [0],
          amplitudeValues: [0, 0, 0, 0, 0, 0],
        },
      },

    list: {
        Piano: {
          title: "Piano",
          img: "https://th.bing.com/th/id/OIP.Cy7-Xf2U_h5Eqrdodq-3iAHaHa?pid=ImgDet&rs=1",
          description: "This plays notes like an instrument",
          instrumentSound: {
            overtoneRelativeAmplitudes: [16,1,1,1,1,1,1,1],
            amplitudeValues: [1, 0.01, 1, 0.02, 0.3, 0.2],
          },
        },
        Guitar: {
          title: "Guitar",
          img: "https://c1.zzounds.com/media/productmedia/fit,2018by3200/quality,85/8_Full_Left_Front_NA-81e49fad9a1e52fd88ddee7d20ce4961.jpg",
          description: "This plays notes like an instrument",
          instrumentSound: {
            overtoneRelativeAmplitudes: [16, 32],
            amplitudeValues: [1, 0.01, 1, 0.02, 0.3, 0.2],
          },
        },
        Trumpet: {
          title: "Trumpet",
          img: "https://th.bing.com/th/id/R.8ed790b6ba497dc03541ea421af556aa?rik=1aSDO7E8zs8s1A&riu=http%3a%2f%2faz58332.vo.msecnd.net%2fe88dd2e9fff747f090c792316c22131c%2fImages%2fProducts1734-1200x1200-1484268.jpg&ehk=9f6hBhiXB%2bY6G%2b18QUPVQk%2b1nv%2bXqtJLvAa6Q8RPlTs%3d&risl=&pid=ImgRaw&r=0",
          description: "This plays notes like an instrument",
          instrumentSound: {
            overtoneRelativeAmplitudes: [1, 2, 6],
            amplitudeValues: [1, 0.01, 1, 0.02, 0.3, 0.2],
          },
        },
        Euphonium: {
          title: "Euphonium",
          img: "https://th.bing.com/th/id/R.f3e629be91dadc03964ba1a3922e7d39?rik=o9PQEuvnJ9%2fe8g&riu=http%3a%2f%2fwww.trevorjonesltd.co.uk%2fimages%2fBesson-967-Euphonium.jpg&ehk=hg3aXfRyvmVnSTn2rax6YwZnPbQpgIkgT4ZhRYnyZlY%3d&risl=&pid=ImgRaw&r=0",
          description: "This plays notes like an instrument",
          instrumentSound: {
            overtoneRelativeAmplitudes: [16, 6, 6, 1, 6, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            amplitudeValues: [1, 0.01, 1, 0.02, 0.3, 0.2],
          },
        },
    },
};


export default InstrumentLibrary;