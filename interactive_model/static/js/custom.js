var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
} 

function downloadPDF() {
  var url = "https://lukecoburn.s3.eu-west-2.amazonaws.com/personal/Luke_Coburn_CV.pdf";
  var link = document.createElement('a');
  link.href = url;
  link.download = 'Luke_Coburn_CV.pdf';
  link.target = '_self'; // Add this line to specify that the file should be downloaded, not opened in a new tab
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function openTab(event, tabName) {
  var i, tabContent, tabButton;

  // Hide all tab content
  tabContent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
  }

  // Remove "active" class from all tab buttons
  tabButton = document.getElementsByClassName("tab-button");
  for (i = 0; i < tabButton.length; i++) {
      tabButton[i].className = tabButton[i].className.replace(" active", "");
  }

  // Show the selected tab content and mark the button as active
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active";
}
