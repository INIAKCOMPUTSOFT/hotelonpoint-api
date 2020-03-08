const mails = {
  mail1: surname => {
    return `<html>
      <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css" />
      <title> ALMOST TIME TO CHECK IN ( REF: XXXXXXX)</title>
    </head>
    
    <body>
      <section style="font-family: Arial, Helvetica, sans-serif; width: 80%; margin: 0 auto;">
        <header style="min-height: 30px; background-color: #a59e83; color:#fff; padding: 1rem;">
          <img src="cid:logo.svg" alt="HotelOnPoints" />
        </header>
        <h3>Hello ${surname}</h3>
        <footer style="margin-top: 2rem;">
          <h3 style="text-transform: uppercase;">
            CHAT &nbsp; TERMS AND CONDITION &nbsp; PRIVACY POLICY
          </h3>
          <p>
    
            This email was sent to <strong>johndoe@email.com</strong> by Hotel On
            Points Ltd. Plot 5a road 2, Off Ebony Road, Port Harcourt, Rivers State
            Nigeria. Phone: <strong>234 &nbsp; 803xxxxxxx</strong> Email:
            support@hotelonpoints.com. Working Hours:
            <strong>Mon - Fri 08h30 & Sat:10h00 - 14h00. Public holidays: 10h00 - 21h00
            </strong>
          </p>
          <div class="icon-div" style="padding: 5px; background-color: black; display: block;">
            <p style="color: azure; "> We Are Social</p>
            <i style="color: azure; margin-right: 3px; padding: 4px;" class="fab fa-facebook-f"></i style="color: azure;">
            <i style="color: azure; margin-right: 3px; padding: 4px;" class="fab fa-instagram"></i>
            <i style="color: azure; margin-right: 3px; padding: 4px;" class="fab fa-twitter"></i>
            <i style="color: azure; margin-right: 3px; padding: 4px;" class="fab fa-youtube"></i>
            <i style="color: azure; margin-right: 3px; padding: 4px;" class="fab fa-linkedin-in"></i>
          </div>
        </footer>
      </section>
    
    </body>
      </html>`
  },
  bookingMail: (
    email,
    reference,
    firstname,
    lastname,
    checkin,
    checkout,
    paymentMethod,
    paid_at,
    hotelName,
    frontDeskPhoneOne,
    roomType,
    amount
  ) => {
    return `
    <body>
    <section style="font-family: Arial, Helvetica, sans-serif; width: 80%; margin: 0 auto;">
      <header style="min-height: 30px; background-color: #a59e83; color:#fff; padding: 1rem;">
        <img src="cid:logo" alt="HotelOnPoints" />
      </header>
  
      <h3>Hello ${firstname} ${lastname}</h3>
      <div class="details-div">
        <p>
          Thank you for booking your Stay with HotelOnPoints.com.
          This confirms that your Booking has been confirmed and Guaranteed.
          Simply Print or present this email at check-in counter.
        </p>
        <div class="book-container">
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book a Taxi</a>
          </div>
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book an Experience</a>
          </div>
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book a Tour</a>
          </div>
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book a Flight</a>
          </div>
        </div>
        <h3>
          Your Booking
        </h3>
        <p>
          Your booking reference: <strong>${reference}</strong>
        </p>
        <p>
          Booked on:<strong>${checkin}</strong>
        </p>
        <br>
        <h3>
          Payment Details
        </h3>
        <p>Total amount: <strong>NGN ${amount}</strong> </p>
        <p>Payment method: <strong>${paymentMethod}</strong> </p>
        <p>Your booking has been made on <b>${paid_at}</b>. Your Stay and quoted price is confirmed but not
          guaranteed.
        </p>
        <p>Payment reference: <strong>${reference}</strong> </p>
        <h3><a href="hotellink">${hotelName}</a></h3>
        <p>Hotel Address</p>
        <p>Phone: <strong>${frontDeskPhoneOne}</strong> </p>
        <br>
  
        <p>
          Your reservation
        </p>
        <p>
          Check-in: <strong> ${checkin}</strong>
        </p>
  
        <p>
          Check-out: <strong> ${checkout} </strong>
        </p>
  
        <p>
          Room type: <strong> ${roomType}</strong>
        </p>
  
        <p>
          Guest Name: <strong> ${firstname} ${lastname} </strong>
        </p>
        <img src="cid:hotelImage"
              width="50%" height="50%">
        <p>
          <a href="#"> Join us! Members can access savings of up to 50% while booking.</a>
        </p>
  
        <h3>Need help with your reservation?</h3>
        <p><strong>Contact </strong></p>
        <p>
          HotelOnPoints.com Phone: <strong> +2349011289347,+2349011362297,+2349087937354,+2349087937353</strong>
        </p>
        <p>
          Contact the property Phone: <strong> Hotel Phone number here </strong>
        </p>
        <p>
          Manage your booking: <strong> You can <a href="https://www.hotelonpoints.com/logintobookings">view your
              reservation</a> or <a href="https://www.hotelonpoints.com/logintobookings">make changes</a> online anytime.
  
          </strong>
        </p>
      </div>
      <footer style="margin-top: 2rem;">
        <h3 style="text-transform: uppercase;">
          CHAT &nbsp; TERMS AND CONDITION &nbsp; PRIVACY POLICY
        </h3>
  
  
  
        <p>
  
          This email was sent to <strong><b>Customer Email</b></strong> by Hotel On
          Points Ltd. Plot 5a road 2, Off Ebony Road, Port Harcourt, Rivers State
          Nigeria. Phone: <strong>+2349011289347,+2349011362297,+2349087937354,+2349087937353</strong> Email:
          support@hotelonpoints.com. Working Hours:
          <strong>Mon - Fri 08h30 & Sat:10h00 - 14h00. Public holidays: 10h00 - 21h00
          </strong>
        </p>
        <div class="icon-div" style="padding: 5px; background-color: black; display: block;">
          <p style="color: azure; "> We Are Social</p>
          <a href="#"><img src="cid:facebook"
              width=4% height=4%> </a>
          <a href="#"><img src="cid:instagram"
              width="4%" height="4%"> </a>
          <a href="#"><img src="cid:twitter"
              width="4%" height="4%"> </a>
          <a href="#"><img src="cid:linkedin"
              width="4%" height="4%"> </a>
          <a href="#"><img src="cid:youtube"
              width="4%" height="4%"> </a>
      </footer>
    </section>
  
  </body>
    `
  },
  bookingMail2: (
    email,
    reference,
    firstname,
    lastname,
    checkin,
    checkout,
    paymentMethod,
    paid_at,
    hotelName,
    frontDeskPhoneOne,
    roomType,
    amount,
    acctNo,
    acctName,
    BankName
  ) => {
    return `
    <body>
    <section style="font-family: Arial, Helvetica, sans-serif; width: 80%; margin: 0 auto;">
      <header style="min-height: 30px; background-color: #a59e83; color:#fff; padding: 1rem;">
        <img src="cid:logo" alt="HotelOnPoints" />
      </header>
  
      <h3>Hello ${firstname} ${lastname}</h3>
      <p>
          Welcome to Hotel-on-points to organize and manage your bookings login to hotel-on-points with
      </p>
      <p>Email: <strong>${email}</strong> </p>
      <p>Password: <strong>123456</strong> </p>
      <div class="details-div">
        <p>
          Thank you for booking your Stay with HotelOnPoints.com.
          This confirms that your Booking has been confirmed and Guaranteed.
          Simply Print or present this email at check-in counter.
        </p>
        <div class="book-container">
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book a Taxi</a>
          </div>
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book an Experience</a>
          </div>
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book a Tour</a>
          </div>
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book a Flight</a>
          </div>
        </div>
        <h3>
          Your Booking
        </h3>
        <p>
          Your booking reference: <strong>${reference}</strong>
        </p>
        <p>
          Booked on:<strong>${checkin}</strong>
        </p>
        <br>
        <h3>
          Payment Details
        </h3>
        <p>Total amount: <strong>NGN ${amount}</strong> </p>
        <p>Payment method: <strong>${paymentMethod}</strong> </p>
        <p>Your booking has been made on <b>${paid_at}</b>. Your Stay and quoted price is confirmed but not
          guaranteed.
        </p>
        <p>Payment reference: <strong>${reference}</strong> </p>
        <h3><a href="hotellink">${hotelName}</a></h3>
        <p>Hotel Address</p>
        <p>Phone: <strong>${frontDeskPhoneOne}</strong> </p>
        <br>
  
        <p>
          Your reservation
        </p>
        <p>
          Check-in: <strong> ${checkin}</strong>
        </p>
  
        <p>
          Check-out: <strong> ${checkout} </strong>
        </p>
  
        <p>
          Room type: <strong> ${roomType}</strong>
        </p>
  
        <p>
          Guest Name: <strong> ${firstname} ${lastname} </strong>
        </p>
        <img src="cid:hotelImage"width="50%" height="50%">
        <p>
          <a href="#"> Join us! Members can access savings of up to 50% while booking.</a>
        </p>
  
        <h3>Need help with your reservation?</h3>
        <p><strong>Contact </strong></p>
        <p>
          HotelOnPoints.com Phone: <strong> +2349011289347,+2349011362297,+2349087937354,+2349087937353</strong>
        </p>
        <p>
          Contact the property Phone: <strong> Hotel Phone number here </strong>
        </p>
        <p>
          Manage your booking: <strong> You can <a href="https://www.hotelonpoints.com/logintobookings">view your
              reservation</a> or <a href="https://www.hotelonpoints.com/logintobookings">make changes</a> online anytime.
  
          </strong>
        </p>
      </div>
      <footer style="margin-top: 2rem;">
        <h3 style="text-transform: uppercase;">
          CHAT &nbsp; TERMS AND CONDITION &nbsp; PRIVACY POLICY
        </h3>
  
  
  
        <p>
  
          This email was sent to <strong><b>Customer Email</b></strong> by Hotel On
          Points Ltd. Plot 5a road 2, Off Ebony Road, Port Harcourt, Rivers State
          Nigeria. Phone: <strong>+2349011289347,+2349011362297,+2349087937354,+2349087937353</strong> Email:
          support@hotelonpoints.com. Working Hours:
          <strong>Mon - Fri 08h30 & Sat:10h00 - 14h00. Public holidays: 10h00 - 21h00
          </strong>
        </p>
        <div class="icon-div" style="padding: 5px; background-color: black; display: block;">
          <p style="color: azure; "> We Are Social</p>
          <a href="#"><img src="cid:facebook"
              width=4% height=4%> </a>
          <a href="#"><img src="cid:instagram"
              width="4%" height="4%"> </a>
          <a href="#"><img src="cid:twitter"
              width="4%" height="4%"> </a>
          <a href="#"><img src="cid:linkedin"
              width="4%" height="4%"> </a>
          <a href="#"><img src="cid:youtube"
              width="4%" height="4%"> </a>
      </footer>
    </section>
  
  </body>
    `
  },
  bookingMail3: (
    email,
    reference,
    firstname,
    lastname,
    checkin,
    checkout,
    paymentMethod,
    paid_at,
    hotelName,
    frontDeskPhoneOne,
    roomType,
    amount,
    acctNo,
    acctName,
    BankName
  ) => {
    return `
    <body>
    <section style="font-family: Arial, Helvetica, sans-serif; width: 80%; margin: 0 auto;">
      <header style="min-height: 30px; background-color: #a59e83; color:#fff; padding: 1rem;">
        <img src="cid:logo" alt="HotelOnPoints" />
      </header>
  
      <h3>Hello ${firstname} ${lastname}</h3>
      <div class="details-div">
        <p>
          Thank you for booking your Stay with HotelOnPoints.com.
          This confirms that your Booking has been confirmed and Guaranteed.
          Simply Print or present this email at check-in counter.
        </p>
        <div class="book-container">
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book a Taxi</a>
          </div>
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book an Experience</a>
          </div>
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book a Tour</a>
          </div>
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book a Flight</a>
          </div>
        </div>
        <h3>
          Your Booking
        </h3>
        <p>
          Your booking reference: <strong>${reference}</strong>
        </p>
        <p>
          Booked on:<strong>${checkin}</strong>
        </p>
        <br>
        <h3>
          Payment Details
        </h3>
        <p>Total amount: <strong>NGN ${amount}</strong> </p>
        <p>Payment method: <strong>${paymentMethod}</strong> </p>
        <p>Your booking has been made on <b>${paid_at}</b>. Your Stay and quoted price is confirmed but not
          guaranteed.
        </p>
        <p>Payment reference: <strong>${reference}</strong> </p>
        <p>Bank: <strong> ${BankName}</strong> </p>
      <p>Account holder: <strong>${acctName}</strong> </p>
      <p>Account number: <strong> ${acctNo} </strong> </p>
      <p> <a href="#">Click Here for other Bank Options </a></p>
        <h3><a href="hotellink">${hotelName}</a></h3>
        <p>Hotel Address</p>
        <p>Phone: <strong>${frontDeskPhoneOne}</strong> </p>
        <br>
  
        <p>
          Your reservation
        </p>
        <p>
          Check-in: <strong> ${checkin}</strong>
        </p>
  
        <p>
          Check-out: <strong> ${checkout} </strong>
        </p>
  
        <p>
          Room type: <strong> ${roomType}</strong>
        </p>
  
        <p>
          Guest Name: <strong> ${firstname} ${lastname} </strong>
        </p>
        <img src="cid:hotelImage"width="50%" height="50%">
        <p>
          <a href="#"> Join us! Members can access savings of up to 50% while booking.</a>
        </p>
  
        <h3>Need help with your reservation?</h3>
        <p><strong>Contact </strong></p>
        <p>
          HotelOnPoints.com Phone: <strong> +2349011289347,+2349011362297,+2349087937354,+2349087937353</strong>
        </p>
        <p>
          Contact the property Phone: <strong> Hotel Phone number here </strong>
        </p>
        <p>
          Manage your booking: <strong> You can <a href="https://www.hotelonpoints.com/logintobookings">view your
              reservation</a> or <a href="https://www.hotelonpoints.com/logintobookings">make changes</a> online anytime.
  
          </strong>
        </p>
      </div>
      <footer style="margin-top: 2rem;">
        <h3 style="text-transform: uppercase;">
          CHAT &nbsp; TERMS AND CONDITION &nbsp; PRIVACY POLICY
        </h3>
  
  
  
        <p>
  
          This email was sent to <strong><b>Customer Email</b></strong> by Hotel On
          Points Ltd. Plot 5a road 2, Off Ebony Road, Port Harcourt, Rivers State
          Nigeria. Phone: <strong>+2349011289347,+2349011362297,+2349087937354,+2349087937353</strong> Email:
          support@hotelonpoints.com. Working Hours:
          <strong>Mon - Fri 08h30 & Sat:10h00 - 14h00. Public holidays: 10h00 - 21h00
          </strong>
        </p>
        <div class="icon-div" style="padding: 5px; background-color: black; display: block;">
          <p style="color: azure; "> We Are Social</p>
          <a href="#"><img src="cid:facebook"
              width=4% height=4%> </a>
          <a href="#"><img src="cid:instagram"
              width="4%" height="4%"> </a>
          <a href="#"><img src="cid:twitter"
              width="4%" height="4%"> </a>
          <a href="#"><img src="cid:linkedin"
              width="4%" height="4%"> </a>
          <a href="#"><img src="cid:youtube"
              width="4%" height="4%"> </a>
      </footer>
    </section>
  
  </body>
    `
  },
  bookingMail4: (
    email,
    reference,
    firstname,
    lastname,
    checkin,
    checkout,
    paymentMethod,
    paid_at,
    hotelName,
    frontDeskPhoneOne,
    roomType,
    amount,
    acctNo,
    acctName,
    BankName
  ) => {
    return `
    <body>
    <section style="font-family: Arial, Helvetica, sans-serif; width: 80%; margin: 0 auto;">
      <header style="min-height: 30px; background-color: #a59e83; color:#fff; padding: 1rem;">
        <img src="cid:logo" alt="HotelOnPoints" />
      </header>
  
      <h3>Hello ${firstname} ${lastname}</h3>
      <p>
          Welcome to Hotel-on-points to organize and manage your bookings login to hotel-on-points with
      </p>
      <p>Email: <strong>${email}</strong> </p>
      <p>Password: <strong>123456</strong> </p>
      <div class="details-div">
        <p>
          Thank you for booking your Stay with HotelOnPoints.com.
          This confirms that your Booking has been confirmed and Guaranteed.
          Simply Print or present this email at check-in counter.
        </p>
        <div class="book-container">
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book a Taxi</a>
          </div>
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book an Experience</a>
          </div>
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book a Tour</a>
          </div>
          <div class="book-div"
            style="border: 0.5px solid #a59e83; display: inline-block; padding: 1rem 2rem; margin: 4px; box-shadow: 1px 1px 3px #383838da;">
            <a href="" style="color: #000000; text-decoration: none;">Book a Flight</a>
          </div>
        </div>
        <h3>
          Your Booking
        </h3>
        <p>
          Your booking reference: <strong>${reference}</strong>
        </p>
        <p>
          Booked on:<strong>${checkin}</strong>
        </p>
        <br>
        <h3>
          Payment Details
        </h3>
        <p>Total amount: <strong>NGN ${amount}</strong> </p>
        <p>Payment method: <strong>${paymentMethod}</strong> </p>
        <p>Your booking has been made on <b>${paid_at}</b>. Your Stay and quoted price is confirmed but not
          guaranteed.
        </p>
        <p>Payment reference: <strong>${reference}</strong> </p>
        <p>Bank: <strong> ${BankName}</strong> </p>
      <p>Account holder: <strong>${acctName}</strong> </p>
      <p>Account number: <strong> ${acctNo} </strong> </p>
      <p> <a href="#">Click Here for other Bank Options </a></p>
        <h3><a href="hotellink">${hotelName}</a></h3>
        <p>Hotel Address</p>
        <p>Phone: <strong>${frontDeskPhoneOne}</strong> </p>
        <br>
  
        <p>
          Your reservation
        </p>
        <p>
          Check-in: <strong> ${checkin}</strong>
        </p>
  
        <p>
          Check-out: <strong> ${checkout} </strong>
        </p>
  
        <p>
          Room type: <strong> ${roomType}</strong>
        </p>
  
        <p>
          Guest Name: <strong> ${firstname} ${lastname} </strong>
        </p>
        <img src="cid:hotelImage"width="50%" height="50%">
        <p>
          <a href="#"> Join us! Members can access savings of up to 50% while booking.</a>
        </p>
  
        <h3>Need help with your reservation?</h3>
        <p><strong>Contact </strong></p>
        <p>
          HotelOnPoints.com Phone: <strong> +2349011289347,+2349011362297,+2349087937354,+2349087937353</strong>
        </p>
        <p>
          Contact the property Phone: <strong> Hotel Phone number here </strong>
        </p>
        <p>
          Manage your booking: <strong> You can <a href="https://www.hotelonpoints.com/logintobookings">view your
              reservation</a> or <a href="https://www.hotelonpoints.com/logintobookings">make changes</a> online anytime.
  
          </strong>
        </p>
      </div>
      <footer style="margin-top: 2rem;">
        <h3 style="text-transform: uppercase;">
          CHAT &nbsp; TERMS AND CONDITION &nbsp; PRIVACY POLICY
        </h3>
  
  
  
        <p>
  
          This email was sent to <strong><b>Customer Email</b></strong> by Hotel On
          Points Ltd. Plot 5a road 2, Off Ebony Road, Port Harcourt, Rivers State
          Nigeria. Phone: <strong>+2349011289347,+2349011362297,+2349087937354,+2349087937353</strong> Email:
          support@hotelonpoints.com. Working Hours:
          <strong>Mon - Fri 08h30 & Sat:10h00 - 14h00. Public holidays: 10h00 - 21h00
          </strong>
        </p>
        <div class="icon-div" style="padding: 5px; background-color: black; display: block;">
          <p style="color: azure; "> We Are Social</p>
          <a href="#"><img src="cid:facebook"
              width=4% height=4%> </a>
          <a href="#"><img src="cid:instagram"
              width="4%" height="4%"> </a>
          <a href="#"><img src="cid:twitter"
              width="4%" height="4%"> </a>
          <a href="#"><img src="cid:linkedin"
              width="4%" height="4%"> </a>
          <a href="#"><img src="cid:youtube"
              width="4%" height="4%"> </a>
      </footer>
    </section>
  
  </body>
    `
  }
}

module.exports = mails
