function getRandomDate(){
    const start = new Date("1995-06-16")
    const end = new Date()
    const randomTime = start.getTime()+(end.getTime()-start.getTime())*Math.random()  
    return new Date(randomTime).toISOString().split("T")[0]

}



const today = new Date().toISOString().split("T")[0]
//document.getElementById("dateInput").setAttribute('max', today)
document.getElementById("dateInput").max=today
document.getElementById("dateInput").value=today


async function fetchAPOD(date = document.getElementById("dateInput").value) {
   const loader = document.getElementById("loader")
   const errorDiv = document.getElementById("error") 
   const apodCard = document.getElementById("apodCard")
   const mediaContainer = document.getElementById("mediaContainer")
   const apodImage =  document.getElementById("apodImage")

   loader.style.display = "block"
   errorDiv.textContent = ""
   apodCard.style.display = "none"
    


   try{
    const apiKey = "YfcRT4OPpNakeHUfo9gWxBXR8KqRdG4g6HdxAtl9"
    let response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`)
    console.log(response)
    if(! response.ok && response.status==404){
        const yesterday = new Date()
        //yesterday is actually todays date
        yesterday.setDate(yesterday.getDate()-1)
       // console.log(yesterday.toISOString().split("T")[0])
        const fallbackDate = yesterday.toISOString().split("T")[0]
        response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${fallbackDate}`)
    }

    if(! response.ok){
        throw new Error(`failed APOD data : ${response.status}`)
    }

    const data = await response.json()
    console.log(data)
    mediaContainer.innerHTML = ""
    mediaContainer.appendChild(apodImage)
    if(data.media_type == "image"){
        apodImage.src = data.url
        apodImage.style.display="block"
    }
    else if(data.media_type=="video"){
        apodImage.style.display = "none"
        const videoFrame = document.createElement("iframe")
        videoFrame.src = data.url
        videoFrame.width="100%"
        videoFrame.style.border = "none"
        videoFrame.allow = "autoplay;encrypted-media"
        mediaContainer.appendChild(videoFrame)
    }
    document.getElementById("apodTitle").textContent = data.title
    apodImage.alt = data.title
    document.getElementById("apodExplanation").textContent = data.explanation
    document.getElementById("apodDate").textContent = data.date
    apodCard.style.display = "flex"
   }    
   catch(error){
    errorDiv.textContent = "error fetching data please try another date or check your API"
   } finally{loader.style.display="none"}


}
async function fetchRandomAPOD() {
    const randomDate = getRandomDate()
    document.getElementById("dateInput").value = randomDate
    await fetchAPOD(randomDate)
   }

fetchAPOD()