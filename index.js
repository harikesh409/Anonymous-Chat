$(document).ready(function () {
	
	var chatPublishChannel = 'chat_send',
		chatSubscribeChannel = 'chat_receive',
	    inputMessage = $('#inputMessage'),
	    inputMessageSubmit = $("#inputMessageSubmit"),
	    messageList = $("#message-list"),
	    onlineUsersList = $("#onlineUsers"),
	    UserName = $("#UserName"),
	    ControlLoc = $("#control"),
	    login = $("#login"),
	    leave = $("#leave"),
	    LoginScreen = $(".overlay"),
	    userlist = [],
	    pub_key = 'pub-c-3a17c6cc-155e-4808-af3f-eb201fb7cc35',
	    sub_key = 'sub-c-43d67b00-538d-11e7-af22-02ee2ddab7fe',
		username,
		ctrlname;

	var weather_states = {
				"Tornado":0,"Tropical Storm":1,"Hurricane":2,"Strong Storms":3,
				"Rain to Snow Showers":5,"Rain / Sleet":6,"Wintry Mix Snow":7,
				"Freezing Drizzle":8,"Drizzle":9,"Freezing Rain":10,"Light Rain":11,
				"Rain":12,"Scattered Flurries":13,"Light Snow":14,"Blowing / Drifting Snow":15,
				"Snow":16,"Hail":17,"Sleet":18,"Blowing Dust / Sandstorm":19,
				"Foggy":20,"Haze / Windy":21,"Smoke / Windy":22,"Breezy":23,
				"Blowing Spray / Windy":24,"Frigid / Ice Crystals":25,"Cloudy":26,
				"Mostly Cloudy":27,"Mostly Cloudy":28,"Partly Cloudy":29,"Partly Cloudy":30,
				"Clear":31,"Sunny":32,"Fair / Mostly Clear":33,"Fair / Mostly Sunny":34,
				"Mixed Rain & Hail":35,"Hot":36,"Isolated Thunderstorms":37,"Thunderstorms":38,
				"Scattered Showers":39,"Heavy Rain":40,"Scattered Snow Showers":41,
				"Heavy Snow":42,"Blizzard":43,"Not Available (N/A)":44,
				"Scattered Showers":45,"Scattered Snow Showers":46,"Scattered Thunderstorms":47,
				"Fair":26,"Fair / Windy":22
			}
			
	var pubnub = PUBNUB({
        publish_key : pub_key,
        subscribe_key : sub_key
    })

	function pub_subscribe(){
		pubnub.subscribe({
		    channel : chatSubscribeChannel,
		    message : function(m){
		        console.log(m)
		        message_listing(m);
		    },
		    error : function (error) {
		        console.log(JSON.stringify(error));
		    }
		});
	}; 

	function message_listing(m){

		if(m.command == "join"){
			userlist.push(m.user);

			var userData = {
				_UserIcon : Math.floor(Math.random() * 8) + 1,
				_UserName : m.user,
				_Location : m.location
			}
			if(userlist.length == 1){
				var userTemplate = ['<li class="media clearList" id={{_UserName}}>',
	                                '<div class="media-body" style="background:#d5e5e1">',
	                                    '<div class="media">',
	                                        '<a class="pull-left" href="#">',
	                                            '<img class="media-object img-circle" style="max-height:40px;" src="assets/img/userImages/{{_UserIcon}}.png" />',
	                                        '</a>',
	                                        '<div class="media-body" >',
	                                            '<h5>{{_UserName}}</h5>',
	                                            '<small class="text-muted" style="text-transform: uppercase;">-{{_Location}}</small>',
	                                        '</div>',
	                                    '</div>',
	                                '</div>',
	                            '</li>'].join("\n");
			}else{
				var userTemplate = ['<li class="media clearList" id={{_UserName}}>',
	                                '<div class="media-body">',
	                                    '<div class="media">',
	                                        '<a class="pull-left" href="#">',
	                                            '<img class="media-object img-circle" style="max-height:40px;" src="assets/img/userImages/{{_UserIcon}}.png" />',
	                                        '</a>',
	                                        '<div class="media-body" >',
	                                            '<h5>{{_UserName}}</h5>',
	                                            '<small class="text-muted" style="text-transform: uppercase;">-{{_Location}}</small>',
	                                        '</div>',
	                                    '</div>',
	                                '</div>',
	                            '</li>'].join("\n");
			}
			var userList = Mustache.render(userTemplate, userData);
	    	onlineUsersList.append(userList);
		
		}else if(m.command == "message"){

			for (var p in weather_states){
				if (p == m.weatherStatus){
					var weatherStatusIcon = weather_states[p];
					break;
				}
				else{
					var weatherStatusIcon = 44;
				}
			}
			var userData = {
					_UserIcon : Math.floor(Math.random() * 8) + 1,
					_UserName : m.user,
					_Location : m.location
				}
			var count = 0;
			for (var i = 0; i < userlist.length; i++) {
				if (userlist[i] !== m.user){
					count++;
				}
				else{
					break;
				}
			};
			if(count == userlist.length){
				userlist.push(m.user);
				var userTemplate = ['<li class="media clearList" id={{_UserName}}>',
                                '<div class="media-body">',
                                    '<div class="media">',
                                        '<a class="pull-left" href="#">',
                                            '<img class="media-object img-circle" style="max-height:40px;" src="assets/img/userImages/{{_UserIcon}}.png" />',
                                        '</a>',
                                        '<div class="media-body" >',
                                            '<h5>{{_UserName}}</h5>',
                                            '<small class="text-muted" style="text-transform: uppercase;">-{{_Location}}</small>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '</li>'].join("\n");

				var userList = Mustache.render(userTemplate, userData);
		    	onlineUsersList.append(userList);
			}
			
			var messageData = {
				_UserIcon 	: Math.floor(Math.random() * 8) + 1,
				userName 		: m.user,
				userlocation : m.location,
		        userMessageBody : m.userMessage,
		        weatherIcon 	: weatherStatusIcon,
		        weatherReport 	: m.weatherStatus
		    }

			var messageTemplate = ['<li class="media clearMsgList" >',
	                            '<div class="media-body">',
	                                '<div class="media">',
	                                    '<a class="pull-left" href="#">',
	                                        '<img class="media-object img-circle" src="assets/img/userImages/{{_UserIcon}}.png" alt="man1" height="40" width="40" />',
	                                    	'<p style="text-align:center;">{{userName}}</p>',
	                                    '</a>',
	                                    '<div class="media-body" >{{userMessageBody}}',
	                                       ' <br />',
	                                       '<small class="text-muted" style="text-transform: uppercase;"> -{{userlocation}} <img height="30" width="30" src="assets/img/weather/png/{{weatherIcon}}.png"> {{weatherReport}} </small>',
	                                        '<hr />',
	                                    '</div>',
	                                '</div>',
	                            '</div>',
	                        '</li>'].join("\n");
	        var list = Mustache.render(messageTemplate, messageData);
	    	messageList.append(list);

	    	var height = 0;
			$('div li').each(function(i, value){
			    height += parseInt($(this).height());
			});

			height += '';

			$('div').animate({scrollTop: height});
		
		}else if(m.command == "leave"){

			$( "li" ).remove( "#"+m.user );
		}
	};

	function send_message(){
		inputMessageSubmit.click(function (event) {
	        var chatMessage = {
	        					"command":"message",
	        					"user":username,
	        					"location":ctrlname,
	        					"userMessage":inputMessage.val()
	        				}
	        if(inputMessage.val().length != 0){
	        	pub_publish(chatMessage);
	        	inputMessage.val("");
	        }
	    });
	};

	login.on( "click", function() {
		pub_subscribe();
		setTimeout(function(){
			var loginData = {"command":"join","user":UserName.val(),"location":ControlLoc.val()}
				username = UserName.val();
				ctrlname = ControlLoc.val();
	        	pub_publish(loginData);
	        	LoginScreen.fadeOut(1000);
	        	setTimeout(function(){
	        		LoginScreen.css("z-index","-10");
	        		UserName.val(""),
	        		ControlLoc.val("Select Your  Location")
	        	},1000);
        	document.getElementById('chat-header-username').innerHTML = username;
        	document.getElementById('chat-header-name').innerHTML = " - -"+ctrlname;
		},1000);
	});

	leave.on( "click", function() {
		var leaveData = {"command":"leave","user":username,"location":ctrlname};
		    pub_publish(leaveData);
		    $( "li" ).remove(".clearMsgList");
		    $( "li" ).remove(".clearList");
		    userlist.length = 0;
		    LoginScreen.css("z-index","10");
		    LoginScreen.fadeIn(1000);
		    pubnub.unsubscribe({
			    channel : chatSubscribeChannel,
			});
	});

	function pub_publish(pub_msg){
		pubnub.publish({
		    channel : chatPublishChannel,
		    message : pub_msg,
		    callback : function(m){
		        console.log(m)
		    }
		});
	};
	
	send_message();

});

