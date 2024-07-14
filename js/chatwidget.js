const apiUrl = "https://backendv1.flatfeebizloans.com/api";

let allButtons = [];
async function getButtons() {
  try {
    const response = await fetch(`${apiUrl}/buttons`, {
      method: "GET"
    });

    const data = await response.json();
    const buttons = data.buttons;
    allButtons = buttons;
    const buttonContainer = document.getElementById("button-container");
    const infoIcon = document.getElementById("info-icon");

    // Function to create buttons and append them to the container
    const createButtons = () => {
      buttons.forEach(buttonData => {
        const button = document.createElement("button");
        button.className = "chat-button";
        button.textContent = buttonData.name;
        button.addEventListener("click", () => handleButtonClick(buttonData));
        buttonContainer.appendChild(button);
      });

      // Hide buttons after 7 seconds
      hideButtonsTimeout = setTimeout(hideButtons, 7000);
    };

    // Function to hide buttons and show the info icon
    const hideButtons = () => {
      buttonContainer.style.display = "none";
      infoIcon.style.display = "flex";
    };

    // Function to show buttons and hide the info icon
    const showButtons = () => {
      buttonContainer.style.display = "flex";
      infoIcon.style.display = "none";
      if (hideButtonsTimeout) {
        clearTimeout(hideButtonsTimeout);
        hideButtonsTimeout = setTimeout(hideButtons, 7000);
      }
    };

    // Event listener for the info icon
    infoIcon.addEventListener("click", showButtons);

    // Initial button creation
    createButtons();
  } catch (error) {
    console.error("Error fetching buttons:", error);
  }
}

// getButtons();

var INDEX = 0;
$(function () {
  $("#chat-submit").click(function (e) {
    e.preventDefault();
    var msg = $("#chat-input").val();
    if (msg.trim() == "") {
      return false;
    }
    generate_message(msg, "self");
    var buttons = [
      {
        name: "Existing User",
        value: "existing",
      },
      {
        name: "New User",
        value: "new",
      },
    ];
    setTimeout(function () {
      generate_message(msg, "user");
    }, 1000);
  });

  async function generate_message(msg, type) {
    console.log("clicked", msg, type);
    INDEX++;
    var str = "";
    str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + '">';
    str += '          <span class="msg-avatar">';
    // str += `<img
    //           src="./image/chat-widget/Elloh Bot.webp"
    //           alt="Elloh Bot"
    //           class="bot-image"
    //         />`;
    str += "          </span>";
    str += '          <div class="cm-msg-text">';
    if (type == "user") {
      const ipAddress = await fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => data.ip);

      const response = await fetch(apiUrl + '/conversation', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg, ip: ipAddress }), // send the message and ipAddress as part of the request body
      });

      const data = await response.json();
      str += data.message; // assuming the response has a 'message' property
    } else {
      str += msg;
    }
    str += "          </div>";
    str += "        </div>";
    $(".chat-logs").append(str);
    $("#cm-msg-" + INDEX)
      .hide()
      .fadeIn(300);
    if (type == "self") {
      $("#chat-input").val("");
    }
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
  }

  function generate_button_message(msg, buttons) {
    /* Buttons should be object array 
      [
        {
          name: 'Existing User',
          value: 'existing'
        },
        {
          name: 'New User',
          value: 'new'
        }
      ]
    */
    INDEX++;
    var btn_obj = buttons
      .map(function (button) {
        return (
          '              <li class="button"><a href="javascript:;" class="btn btn-primary chat-btn" chat-value="' +
          button.value +
          '">' +
          button.name +
          "</a></li>"
        );
      })
      .join("");
    var str = "";
    str += "<div id='cm-msg-" + INDEX + '\' class="chat-msg user">';
    str += '          <span class="msg-avatar">';
    str +=
      '            <img src="https://image.crisp.im/avatar/operator/196af8cc-f6ad-4ef7-afd1-c45d5231387c/240/?1483361727745">';
    str += "          </span>";
    str += '          <div class="cm-msg-text">';
    str += msg;
    str += "          </div>";
    str += '          <div class="cm-msg-button">';
    str += "            <ul>";
    str += btn_obj;
    str += "            </ul>";
    str += "          </div>";
    str += "        </div>";
    // replace if any link as text with anchor tag
    str = str.replace(/((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/g, "<a href='$1'>$1</a>");
    $(".chat-logs").append(str);
    $("#cm-msg-" + INDEX)
      .hide()
      .fadeIn(300);
    $(".chat-logs")
      .stop()
      .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    $("#chat-input").attr("disabled", true);
  }

  $(document).delegate(".chat-btn", "click", function () {
    var value = $(this).attr("chat-value");
    var name = $(this).html();
    $("#chat-input").attr("disabled", false);
    generate_message(name, "self");
  });


  $("#chat-circle").click(function () {
    $("#chat-circle").toggle("scale");
    $(".chat-box").toggle("scale");
    getButtons();
  });

  $(".chat-box-toggle").click(async function () {

    const ipAddress = await fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => data.ip);

    $("chat-close").click(function () {
      $(".chat-logs").empty(); // Clear the chat logs
      $(".chat-logs").append('<div id="button-container"></div><i id="info-icon" class="fa fa-info-circle info-icon" title="Show Actions"></i>');
      $("#chat-circle").toggle("scale");
      $(".chat-box").toggle("scale");
    });

    // const response = await fetch("http://127.0.0.1:5000/api/clear", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ ip: ipAddress }), // send the ipAddress as part of the request body
    // });

    $(".chat-logs").empty(); // Clear the chat logs
    $(".chat-logs").append('<div id="button-container"></div><i id="info-icon" class="fa fa-info-circle info-icon" title="Show Actions"></i>');
    $("#chat-circle").toggle("scale");
    $(".chat-box").toggle("scale");
  });


});

async function handleButtonClick(button) {
  console.log("Button clicked:", button);
  INDEX++;
  // Create a new chat message element
  const createChatMessage = (index, type, message) => {
    return `
      <div id="cm-msg-${index}" class="chat-msg ${type}">
        <span class="msg-avatar"></span>
        <div class="cm-msg-text">${message}</div>
      </div>`;
  };

  // Append user message to chat logs
  const userMessage = createChatMessage(INDEX, 'self', button.name);
  $(".chat-logs").append(userMessage);
  $(`#cm-msg-${INDEX}`).hide().fadeIn(300);
  $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);

  // Reset chat input
  $("#chat-input").val("");

  // Fetch IP address
  const ipAddress = await fetch("https://api.ipify.org?format=json")
    .then(response => response.json())
    .then(data => data.ip);

  // Send message and IP address to the server
  const response = await fetch(apiUrl + '/conversation', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: button._id, ip: ipAddress }),
  });

  // Get response data from server
  const data = await response.json();

  // Append bot response to chat logs
  const botMessage = createChatMessage(INDEX, 'user', data.message);
  $(".chat-logs").append(botMessage);
  $(`#cm-msg-${INDEX}`).hide().fadeIn(300);
  $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);

  // Hide buttons after clicking
  const buttonContainer = document.getElementById("button-container");
  const infoIcon = document.getElementById("info-icon");
  hideButtons();
}

function hideButtons() {
  console.log("Hiding buttons");
  const buttonContainer = document.getElementById("button-container");
  const infoIcon = document.getElementById("info-icon");
  buttonContainer.style.display = "none";
  infoIcon.style.display = "flex";
}

function showButtons() {
  const buttonContainer = document.getElementById("button-container");
  const infoIcon = document.getElementById("info-icon");
  buttonContainer.style.display = "flex";
  infoIcon.style.display = "none";
  console.log("Showing buttons", hideButtonsTimeout);
  if (hideButtonsTimeout) {
    clearTimeout(hideButtonsTimeout);
    hideButtonsTimeout = setTimeout(hideButtons, 7000);
  }

}
