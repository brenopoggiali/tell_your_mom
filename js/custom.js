$(".clockpicker")
  .clockpicker({
    placement: "bottom",
    align: "left",
    donetext: "Done"
  })
  .find("input")
  .change(function() {
    saveUserInput({ timeToSend: this.value });
  });

chrome.storage.sync.get(
  ["momName", "timeToSend", "msgToSend", "isOn"],
  ({ momName, timeToSend, msgToSend, isOn }) => {
    $("#momName").val(momName);
    $("#timeToSend").val(timeToSend);
    $("#msgToSend").val(msgToSend);
    $("#isOnCheckbox").attr("checked", isOn);
  }
);

$("#buttonSender").click(() => {
  saveUserInput({
    momName: $("#momName")
      .val()
      .trim(),
    timeToSend: $("#timeToSend").val(),
    msgToSend: $("#msgToSend").val(),
    isOn: $("#isOnCheckbox").is(":checked")
  });
  window.close();
});

$("#isOnCheckbox").change(function() {
  saveUserInput({ isOn: this.checked });
});

function saveUserInput({
  momName: momNameP,
  timeToSend: timeToSendP,
  msgToSend: msgToSendP,
  isOn: isOnP
}) {
  chrome.storage.sync.get(
    ["momName", "timeToSend", "msgToSend", "isOn"],
    ({ momName, timeToSend, msgToSend, isOn }) => {
      chrome.storage.sync.set({
        momName: momNameP || momName,
        timeToSend: timeToSendP || timeToSend,
        msgToSend: msgToSendP || msgToSend,
        isOn: isOnP !== undefined ? isOnP : isOn
      });
    }
  );
}
