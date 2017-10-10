/**
 * Created by Administrator on 2017/9/30 0030.
 */
/*=====DOM节点=====*/
var $cityTime=$(".cityTime"),
    $todayWheather=$(".todayWheather"),
    $afterWheatherLi=$(".afterWheather li")


/*=====根据定位获取天气数据=====*/
$.ajax({   //获取定位地址的天气
    url: `https://weixin.jirengu.com/weather`,  //地址
    type:"get",   //发送方式
    dataType:"json"   //说明接受到后端数据的格式为json
}).done(function(ret) {  //接收后端数据成功
    let weather=ret.weather[0],
        temperature=weather.now.temperature,
        code=weather.now.code,
        wind_speed=weather.now.wind_speed,
        quality=weather.now.air_quality.city.quality

    /*设置城市和时间*/
    setLocaltionDom(weather.city_name)

    /*设置今天温度和图片*/
    setTodaytemperatureDom(temperature,code,wind_speed,quality)

    /*设置未来一周的天气*/
    afterWeekWeather(weather.future)
})

/*=====根据用户输入获取天气数据=====*/
let $input=$('.inputWrap input')
$input.on('keydown',function(e){
    /*用户点击回车*/
    if(e.keyCode == "13"){
        /*获得input的输入值*/
        let inputValue=$input.toPinyin()
        $.ajax({   //  获取城市cityid
            url: `https://weixin.jirengu.com/weather/cityid?location=${inputValue}`,
            type:"get",   //发送方式
            dataType:"json"   //说明接受到后端数据的格式为json
        }).done(function(ret) {  //接收后端数据成功
            $.ajax({   //获取对应cityid的天气
                url: `https://weixin.jirengu.com/weather/now?cityid=${ret.results[0].id}`,
                type:"get",   //发送方式
                dataType:"json"   //说明接受到后端数据的格式为json
            }).done(function(ret) {  //接收后端数据成功
                let weather=ret.weather[0],
                    temperature=weather.now.temperature,
                    code=weather.now.code,
                    wind_speed=weather.now.wind_speed,
                    quality=weather.now.air_quality.city.quality

                /*设置城市和时间*/
                setLocaltionDom(weather.city_name)

                /*设置今天温度和图片*/
                setTodaytemperatureDom(temperature,code,wind_speed,quality)

                /*设置未来一周的天气*/
                afterWeekWeather(weather.future)

                /*清空input的值*/
                $input.val('')
            })
        })
    }
})

/*地址和时间*/
function setLocaltionDom(city){
    let myDate = new Date(),
        h=myDate.getHours(),
        m=myDate.getMinutes(),
        s=myDate.getSeconds()

    var date=`${h}:${m}:${s}`
    var $LocaltionDom=$(` <p>${city}</p>
                       <p>${date}</p>`)
    $cityTime.html($LocaltionDom)
}
/*今天天气*/
function setTodaytemperatureDom(temperature,code,windSpeed,quality){
    let myDate = new Date(),
        month=myDate.getMonth(),
        date=myDate.getDate()
        montharr=['January','February','March','April','May','June','July','August','September','October','November','December']

    var $TodaytemperatureDom=$(`<div class="todaytemperature">
                                     <div>
                                       <span class="number">${temperature}°</span>
                                     </div>
                                     <img src="http://weixin.jirengu.com/images/weather/code/${code}.png"/>
                                </div>
                                <div class="today">
                                      <span class="calendar">${montharr[month]} ${date}th</span>
                                      <span class="airQuality">${windSpeed}mph <i>/</i>  ${quality}</span>
                                </div>`)
    $todayWheather.html($TodaytemperatureDom)
}
/*未来一个星期的天气*/
function afterWeekWeather(weathers){
    for (var i=0;i<$afterWheatherLi.length;i++){
        var $afterWeekWeatherDom=$(`<div class="week"><span>${weathers[i].day}</span></div>
                <div><img src="http://weixin.jirengu.com/images/weather/code/${weathers[i].code1}.png"/></div>
                <div>最高: ${weathers[i].high}°</div>
                <div>最低: ${weathers[i].low}°</div>`)
        $afterWheatherLi.eq(i).html($afterWeekWeatherDom)
    }

}


