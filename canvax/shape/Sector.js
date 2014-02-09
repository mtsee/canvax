/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 扇形 类
 *
 * 坐标原点再圆心
 *
 * 对应context的属性有
 * @r0 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
 * @r  必须，外圆半径
 * @startAngle 起始角度(0, 360)
 * @endAngle   结束角度(0, 360)
 **/


KISSY.add("canvax/shape/Sector" , function(S , Shape , myMath , Polygon , Base){
 
   var Sector = function(opt){
       var self  = this;
       self.type = "sector";

       opt = Base.checkOpt( opt );
       self.clockwise =  opt.clockwise || false;//是否顺时针，默认为false(顺时针)

       self._context  = {
           pointList  : [],//边界点的集合,私有，从下面的属性计算的来
           r0         : opt.context.r0         || 0,// 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
           r          : opt.context.r          || 0,//{number},  // 必须，外圆半径
           startAngle : opt.context.startAngle || 0,//{number},  // 必须，起始角度[0, 360)
           endAngle   : opt.context.endAngle   || 0 //{number},  // 必须，结束角度(0, 360]
       }
       arguments.callee.superclass.constructor.apply(this , arguments);
   };

   Base.creatClass(Sector , Shape , {
       draw : function(ctx, style) {
           
           // 形内半径[0,r)
           var r0 = typeof style.r0 == 'undefined' ? 0 : style.r0;
           var r = style.r;                            // 扇形外半径(0,r]
           var startAngle = style.startAngle;          // 起始角度[0,360)
           var endAngle   = style.endAngle;              // 结束角度(0,360]

           startAngle = myMath.degreeToRadian(startAngle);
           endAngle   = myMath.degreeToRadian(endAngle);

           ctx.arc( 0 , 0 , r, startAngle, endAngle, this.clockwise);
           if (r0 !== 0) {
               ctx.arc( 0 , 0 , r0, endAngle , startAngle, !this.clockwise);
           }
        },
        getRect : function(style){
            var style = style ? style : this.context;
            var r0 = typeof style.r0 == 'undefined'     // 形内半径[0,r)
                ? 0 : style.r0;
            var r = style.r;                            // 扇形外半径(0,r]
            var startAngle = myMath.degreeTo360(style.startAngle);            // 起始角度[0,360)
            var endAngle   = myMath.degreeTo360(style.endAngle);              // 结束角度(0,360]

            var regIn      = true;  //如果在start和end的数值中，end大于start而且是顺时针则regIn为true
            if ( (startAngle > endAngle && !this.clockwise ) || (startAngle < endAngle && this.clockwise ) ) {
                regIn      = false;
            }
            //度的范围，从小到大
            var regAngle   = [ Math.min( startAngle , endAngle ) , Math.max( startAngle , endAngle ) ];

            var pointList  = [];

            var p4Direction= {
                "90" : [ 0 , r ],
                "180": [ -r, 0 ],
                "270": [ 0 , -r],
                "360": [ r , 0 ] 
            };

            for ( var d in p4Direction ){
                var inAngleReg = parseInt(d) > regAngle[0] && parseInt(d) < regAngle[1];
                if( (inAngleReg && regIn) || (!inAngleReg && !regIn) ){
                    pointList.push( p4Direction[ d ] );
                }
            }

            startAngle = myMath.degreeToRadian(startAngle);
            endAngle   = myMath.degreeToRadian(endAngle);

            pointList.push([
                    myMath.cos(startAngle) * r0 , myMath.sin(startAngle) * r0
                    ]);

            pointList.push([
                    myMath.cos(startAngle) * r  , myMath.sin(startAngle) * r
                    ]);

            pointList.push([
                    myMath.cos(endAngle)   * r  ,  myMath.sin(endAngle)  * r
                    ]);

            pointList.push([
                    myMath.cos(endAngle)   * r0 ,  myMath.sin(endAngle)  * r0
                    ]);

            style.pointList = pointList;
            return Polygon.prototype.getRect(style);

        }

   });

   return Sector;

},{
   requires:[
     "canvax/display/Shape",
     "canvax/utils/Math",
     "canvax/shape/Polygon",
     "canvax/core/Base"
   ]
});
