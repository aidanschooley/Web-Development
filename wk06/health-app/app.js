const stateName = document.getElementById("stateName") //get statename


function getHealthDataState(name) {

    //i believe you need to go to the cors website and allow access or something like that possibly
    fetch('https://disease.sh/v3/covid-19/states/' + name)
        .then(response => response.json())
        .then(data => {
            if (data.response === "error") {
                document.getElementById("stateName").innerHTML = "State not found";

                return;

            }
            //successful search
            document.getElementById("state").innerHTML = data.state;

            var xValues = ["Total Cases", "Total Deaths"];
            var yValues = [data.cases, data.deaths];
            var barColors = [
                "#b91d47",
                "#00aba9",
            ];

            window.myChart = new Chart("myChart", {
                type: "pie",
                data: {
                    labels: xValues,
                    datasets: [{
                        backgroundColor: barColors,
                        data: yValues
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "Total Cases vs. Total Deaths"
                    }
                }
            });


        })
        .catch(error => {
            console.error("Error fetching state:", error);
            document.getElementById("state").innerHTML.value = "Superhero Not Found"

        })

  
    
};
