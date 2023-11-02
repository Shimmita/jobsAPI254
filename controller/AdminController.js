const puppeteer = require("puppeteer");
require("dotenv/config");
const JobSchema = require("../model/Job");
const User = require("../model/User");

//POST request handler
const handlePostJobs = async (req, res) => {
  //varible names similar data variables in the database
  const email = req.params.EMAIL_ID;
  const key = req.params.API_KEY;
  const error_message_email = `error, the email provided (${email}) is not recognised by the system. provide a registered email address`;
  const error_message_api = `error, the API_KEY (${key}) provided is wrong please provide a valid API_KEY`;
  const error_bad_email = `error, this email (${email}) doesn't pass email requirements, is a bad email address `;

  //check legibility of the email address, disallow bad email addresseses
  const email_result = emailVailidator(email);

  if (email_result) {
    //email passed test of a good email proceed email validation
    //locate the email of the user in the database
    const result = await User.findOne({ email });
    if (!result) {
      //email not registered since null data returned
      res.status(400).json({
        message: error_message_email,
      });
    } else {
      //email provided is valid. proceed API_KEY validation
      if (result.key == key) {
        //

        /* SOLVE BUG PRESENT LINK 1 NAND LINK 4
         */

        //general init of puppeteer
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        try {
          //link1

          console.log("begin link 1");

          await page.goto(process.env.LINK_SRC_1, {
            waitUntil: "load",
            timeout: 0,
          });
          const data_1 = await page.evaluate(() =>
            Array.from(
              document.querySelectorAll(".jobs-search__results-list li"),
              (element) => ({
                title: element.querySelector("span").innerText,
                organisation: element.querySelector("h4 a").innerText,
                link: element.querySelector("a").href,
              })
            )
          );

          console.log("end data link 1");

          //add data of 1

          //link2
          console.log("begin link 2");

          await page.goto(process.env.LINK_SRC_2, {
            waitUntil: "load",
            timeout: 0,
          });
          const data_2 = await page.evaluate(() =>
            Array.from(
              document.querySelectorAll("#serviceList > li"),
              (element) => ({
                title: element.querySelector("a").textContent,
                organisation: element.querySelector("h3 a").innerText,
                link: element.querySelector("a").href,
              })
            )
          );

          console.log("end data link 2");

          //merging data 1 and data 2
          const first_state = data_1.concat(data_2);
          console.log("first merge successful");

          //link 3
          console.log("begin link 3");

          await page.goto(process.env.LINK_SRC_3, {
            waitUntil: "load",
            timeout: 0,
          });
          const data_3 = await page.evaluate(() =>
            Array.from(
              document.querySelectorAll(
                "#list-container > div > div > div > div"
              ),
              (element) => ({
                title: element.querySelector(".job-title").innerText,
                organisation: element.querySelector(".company-name").innerText,
                link: element.querySelector(".job-title").href,
              })
            )
          );
          console.log("end data link 3");

          //second merge of the data
          const second_state = first_state.concat(data_3);

          /* const second_state = data_2.concat(data_3);
          console.log("second merge successfull"); */

          //link4
          console.log("begin link 4");

          await page.goto(process.env.LINK_SRC_4, {
            waitUntil: "load",
            timeout: 0,
          });
          const data_4 = await page.evaluate(() =>
            Array.from(
              document.querySelectorAll(
                "#search-content > ul.jobs > li > article"
              ),
              (element) => ({
                title: element.querySelector("a").innerText,
                organisation: element.querySelector("p").innerText,
                link: element.querySelector("a").href,
              })
            )
          );
          console.log("end data link 4");

          //third merge of the data
          const third_state = second_state.concat(data_4);

          console.log("third merge successful");

          //link 5
          console.log("begin link 5");

          await page.goto(process.env.LINK_SRC_5, {
            waitUntil: "load",
            timeout: 0,
          });
          const data_5 = await page.evaluate(() =>
            Array.from(
              document.querySelectorAll(".job-list .mag-b"),
              (element) => {
                const title = element.querySelector("a").innerText;
                const link = element.querySelector("a").href;

                const startIndex = title.indexOf("at");

                var organisation = "";

                if (startIndex != -1) {
                  organisation = title.slice(startIndex + 2);
                } else organisation = title;

                return {
                  title: title,
                  organisation: organisation,
                  link: link,
                };
              }
            )
          );

          console.log("end data link 5");

          //fourth maerge
          const fourth_state = third_state.concat(data_5);

          /*  const fourth_state = second_state.concat(data_5); */
          //
          console.log("fourth merge successful");

          //link 6 extension SRC_3
          console.log("begin link 6");

          await page.goto(process.env.LINK_SRC_6, {
            waitUntil: "load",
            timeout: 0,
          });
          const data_6 = await page.evaluate(() =>
            Array.from(
              document.querySelectorAll(
                "#list-container > div > div > div > div"
              ),
              (element) => ({
                title: element.querySelector(".job-title").innerText,
                organisation: element.querySelector(".company-name").innerText,
                link: element.querySelector(".job-title").href,
              })
            )
          );
          console.log("end data link 6");

          //mergin data
          const fifth_state = fourth_state.concat(data_6);
          console.log("fifth merge successful");

          //link 7
          console.log("begin link 7");

          await page.goto(process.env.LINK_SRC_7, {
            waitUntil: "load",
            timeout: 0,
          });
          const data_7 = await page.evaluate(() =>
            Array.from(
              document.querySelectorAll(
                "#initial_job_list > ul .job-tile-title"
              ),
              (element) => ({
                title: element.querySelector(" a > span:nth-child(1)")
                  .innerText,
                organisation: element.querySelector(" a > span:nth-child(3)")
                  .innerText,
                link: element.querySelector("a").href,
              })
            )
          );
          console.log("end data link 7");
          //merging data
          const sixth_state = fifth_state.concat(data_7);
          console.log("sixth merger successful");

          //link 8

          console.log("begin link 8");

          await page.goto(process.env.LINK_SRC_8, {
            waitUntil: "load",
            timeout: 0,
          });
          const data_8 = await page.evaluate(() =>
            Array.from(
              document.querySelectorAll("#job-list > li > div.row"),
              (element) => ({
                title: element.querySelector("a > h3").innerText,
                organisation: element.querySelector("a > p").innerText,
                link: element.querySelector("a").href,
              })
            )
          );
          console.log("end data link 8");

          // merging the data
          const seventh_state = sixth_state.concat(data_8);
          console.log("seventh merge successfull ");

          /* //link 9
          console.log("begin link 9");

          await page.goto(process.env.LINK_SRC_9, {
            waitUntil: "load",
            timeout: 0,
          });
          const data_9 = await page.evaluate(() =>
            Array.from(
              document.querySelectorAll(".jobs-search__results-list li"),
              (element) => ({
                title: element.querySelector("span").innerText,
                organisation: element.querySelector("h4 a").innerText,
                link: element.querySelector("a").href,
              })
            )
          );

          console.log("end data link 9");

          //merging the data
          const eight_state = seventh_state.concat(data_9); */

          //before saving the data into the database, verify that the data is not null
          if (seventh_state.length > 1) {
            console.log("checking overal length of the data");

            //@least there is one or more data  save it
            //saving the data to the database
            const message_success = `data retrieved and saved successfully`;
            await JobSchema.insertMany(seventh_state);
            //final returning the reuslts to the frontend
            await res.status(200).json({
              message: message_success,
              data: seventh_state, //seventh_state
            });

            //log the result to the console
            console.log(message_success);
          } else {
            //the array is empty thus cannot save the data
            const error_locating_data =
              "no data saved, locating the data from servers failed";
            res.status(400).json({
              message: error_locating_data,
            });
          }

          //closing the browser to avoid more data consumption
          await browser.close();
        } catch (error) {
          //close the browser
          await browser.close();
          //log the error message
          await res.status(400).json({ message: error.message });

          //console log the messsage
          console.log(error.message);
        }

        //
      } else {
        //the key is invalid thus user not admin. flag user
        res.status(400).json({
          message: error_message_api,
        });
      }
    }
  } else {
    //disallow the email address since its bad email type
    res.status(400).json({
      message: error_bad_email,
    });
  }
};

//fun that validates the email address
//check email if is valid
function emailVailidator(email) {
  // Regular expression for a valid email address
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return emailRegex.test(email);
}

//exporting the function
module.exports = { handlePostJobs };
