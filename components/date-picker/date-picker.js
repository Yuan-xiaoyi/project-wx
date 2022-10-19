// components/date-picker/date-picker.js
// components/pickerYMDHM/pickerYMDHM.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: null,    
      value: null
    },
    value: {
      type: null,    
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pickerArray: [],
    select: [0, 0, 0, 0],
    pickerChanged: [0,0,0,0]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInit() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const horus = date.getHours()
      const yearArr = this.getLoopArray(year, year + 100, '年')
      const monthArr = this.getLoopArray(month, 12, '月')
      const dayArr = this.getMonthDay(year, month,  day)
      const hoursArr = this.getLoopArray(horus, 23, '时')
      this.setData({
        pickerArray: [yearArr, monthArr, dayArr, hoursArr]
      })
      
      

    },

    withData(param){
       return param < 10 ? '0' + param : '' + param;
    },

    getMonthDay(year, startMonth, startDay) {
      startMonth = this.withData(startMonth)
      startDay = this.withData(startDay)

      let flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = [];
      switch (startMonth) {
        case '01':
        case '03':
        case '05':
        case '07':
        case '08':
        case '10':
        case '12':
         array = this.getLoopArray(startDay, 31, '日')
         break;
        case '04':
        case '06':
        case '09':
        case '11':
         array = this.getLoopArray(startDay, 30, '日')
         break;
        case '02':
         array = flag ? this.getLoopArray(startDay, 29, '日') : this.getLoopArray(startDay, 28, '日')
         break;
        default:
         array = this.getLoopArray(1, 31, '日')
        }
        return array;
    },

    getLoopArray(start, end, unit) {
      start = Number(start)
      end = Number(end)
      const arr = []
      for(let i = start; i <= end; i++) {
        arr.push({
          id: i < 10 ? '0' + i  : '' + i , name: (i < 0 ? '0' + i  : '' + i)+ unit
        })
      }
      return arr
    },

    createdPicker() {
      const date = new Date()
      const currentYear = date.getFullYear()
      const currentMonth = date.getMonth() + 1
      const currentDay = date.getDate()
      const currentHorus = date.getHours()
      const pickerChanged = this.data.pickerChanged
      let [yearArr, monthArr, dayArr, hoursArr] = this.data.pickerArray
      const changedYear = yearArr[pickerChanged[0]]
      const changedMonth = monthArr[pickerChanged[1]]
      const changedDay = dayArr[pickerChanged[2]]
      const changedHours = hoursArr[pickerChanged[3]]
      if (pickerChanged[0] != 0) {
        monthArr = this.getLoopArray(1, 12, '月')
        dayArr = this.getMonthDay(changedYear, changedMonth, 0)
        hoursArr = this.getLoopArray(1, 23, '时')
      } else {
        monthArr = this.getLoopArray(currentMonth, 12, '月')
        if (pickerChanged[1] != 0) {
          dayArr = this.getMonthDay(changedYear, changedMonth, 0)
          hoursArr = this.getLoopArray(1, 23, '时')
        } else {
          dayArr = this.getMonthDay(currentYear, currentMonth, currentDay)
          if (pickerChanged[2] != 0) {
            hoursArr = this.getLoopArray(1, 23, '时')
          } else {
            hoursArr = this.getLoopArray(currentHorus, 23, '时')
          }
        }
      }
      this.setData({
        pickerArray: [yearArr, monthArr, dayArr, hoursArr],
      })

    },

    
    pickerColumnChange(e) {
      const column = e.detail.column, value = e.detail.value
      const pickerArray = this.data.pickerArray
      const pickerChanged = this.data.pickerChanged
      pickerChanged[column] = value
      if(column == 0) {
        pickerChanged[1] = 0
        pickerChanged[2] = 0
        pickerChanged[3] = 0
      }

      if (column == 1) {
        pickerChanged[2] = 0
        pickerChanged[3] = 0
      }

      if (column == 2) {
        pickerChanged[3] = 0
      }

      this.setData({
        pickerChanged: pickerChanged
      })
      this.createdPicker()
      
    },

    pickerChange(e) {
      const selectedIndex = e.detail.value
      const pickerArray = this.data.pickerArray
      console.log(pickerArray, selectedIndex)
      const dateStr = pickerArray[0][selectedIndex[0]].id + '-' + pickerArray[1][selectedIndex[1]].id + '-' + pickerArray[2][selectedIndex[2]].id + ' ' + pickerArray[3][selectedIndex[3]].id + ":00:00"
      this.triggerEvent('onPickerChange', dateStr);
      this.setData({
        value: dateStr
      })
    }
   
  },
  ready() {
    this.onInit();
  },
  lifetimes: {
    ready() {
      // console.log('进入ready节点=', this.data.date);
      this.onInit();
    }
  }
})

