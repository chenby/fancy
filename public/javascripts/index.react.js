var Cloth_wrap= React.createClass({
	getInitialState: function () {
	    return {
	      data:
	      	[{
	      		'src':'/images/cloth/1.jpg',
	      		'name':'夏装时尚T恤+气质阔腿裤套装',
	      		'price':120,
	      		'zan':189
	      		
	      	},{
	      		'src':'/images/cloth/2.jpg',
	      		'name':'夏装asdT恤+气质阔腿裤套装',
	      		'price':230,
	      		'zan':189
	      	},{

	      		'src':'/images/cloth/3.jpg',
	      		'name':'夏asdwr恤+气质阔腿裤套装',
	      		'price':110,
	      		'zan':11
	      	}]
	    }
	},
	componentWillMount:function(){
		console.log('bigin');
		$.post('goods_get',function(data){
				var data =JSON.parse(data)
				  for (var i = 0; i < data.length; i++) {
				  	data[i].src='/images/cloth/'+data[i].src+'.jpg';
				  	data[i].zan=112;
				};
					var da = this.state.data.concat(data);
					this.setState({'data':da});

				}.bind(this)
				)
	},
	componentDidUpdate:function(){
		$('.add_shop').click(function(){
			var sp = $(this).parents('div').prev('p').children('a').html();
			var price_str= $(this).prev('span').prev('b').children('i').html();
			$.post('add_to_cart',{sp:sp,price:price_str},function(){
				alert('加入购物车成功')
			})	
		})

	},
	render:function(){
		return (
				<span>
				{
					this.state.data.map(function(res){
					 return <div className="data-cloth">
					 		<a><img src={res.src} /></a>
					 		<p className="date-cloth-p"><a >{res.name}</a> </p>
						 	<div className="data-title">
						 		<b >￥<i>{res.price}</i></b>
							 	<span className='title-span'><a >{res.zan}</a></span>
							 	<a className="add_shop" href="javascript:void(0)">加入购物车</a>
							</div>
							</div>
							 
					})
				}
			</span>
		);
	}
})
React.render(
  <Cloth_wrap />,
  document.getElementById('data-cloth')
);