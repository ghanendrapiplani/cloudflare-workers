package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"sort"
	"time"
)

var urlDefault string = "https://myapp.gpiplani.workers.dev/links"
var errCodesList map[int]int
var timesList []float64
var sizeList []int
var printBodyBool bool

func main() {
	errCodesList = make(map[int]int)

	urlPtr := flag.String("url", urlDefault, "Usage: --url <'https://abc.com'>")

	profilePtr := flag.Int("profile", 1, "Usage: --profile <integer value>")

	printBodyPtr := flag.Int("printbody", 1, "Usage: --printbody <0 for no | any other int for yes>")

	flag.Parse()

	var u string = *urlPtr
	var profile int = *profilePtr
	var printBodyInt int = *printBodyPtr

	parsedUrl, err := url.Parse(u)

	if err != nil {
		log.Fatalln("Invalid URL ")
			}

	var finalUrl = parsedUrl.String()

	if profile <= 0 {
		log.Fatalln("--profile must be more than 0")
	}

	if printBodyInt == 0 {
		printBodyBool = false
	} else {
		printBodyBool = true
	}

	var i int
	for i = 0; i < profile; i++ {
		getStats(finalUrl)
	}

	var failedReqNum = 0
	var errCodes []int

	for k, v := range errCodesList {
		failedReqNum += v
		errCodes = append(errCodes, k)
	}

	//fmt.Println("Number of requests ",len())
	var meanTime float64
	var medTime float64

	for i := 0; i < len(timesList); i++ {
		meanTime += timesList[i]
	}

	meanTime = meanTime / float64(len(timesList))

	var listLen = len(timesList)
	var middle = listLen / 2
	if listLen%2 == 0 {
		medTime = (timesList[middle-1] + timesList[middle]) / 2
	} else {
		medTime = timesList[middle]
	}
	fmt.Println("\n\n========================= STATS =========================\n\n")
	fmt.Println("URL tested =", finalUrl)
	fmt.Println("Number of requests =", i)
	sort.Float64s(timesList)
	fmt.Printf("Fastest Request time = %.2fms \n", timesList[0])
	fmt.Printf("Slowest Request time = %.2fms \n", timesList[len(timesList)-1])
	fmt.Printf("Mean of request times = %.2fms \n", meanTime)
	fmt.Printf("Median of request times = %.2fms \n", medTime)
	sort.Ints(sizeList)
	fmt.Println("Size of bytes in largest response =", sizeList[len(sizeList)-1], " bytes")
	fmt.Println("Size of bytes in smallest response =", sizeList[0], " bytes")
	var percentFailed = (float64(failedReqNum / i)) * 100
	fmt.Printf("Percent of Successful Requests = %.2f%% \n", 100-percentFailed)
	fmt.Printf("Percent of Failed Requests = %.2f%% \n", percentFailed)
	if len(errCodes) > 0 {
		fmt.Print("Error codes : ", errCodes)
	}
}

func getStats(finalUrl string) {
	startTime := time.Now()
	resp, err := http.Get(finalUrl)
	if err != nil {
		log.Fatalln(err)
	}

	if resp.StatusCode >= 400 && resp.StatusCode <= 599 {
		if _, ok := errCodesList[resp.StatusCode]; ok {
			errCodesList[resp.StatusCode] += 1
		} else {
			errCodesList[resp.StatusCode] = 1
		}
	}

	defer resp.Body.Close()
	timeElapsed := time.Now().Sub(startTime).Milliseconds()

	timesList = append(timesList, float64(timeElapsed))
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	sizeList = append(sizeList, len(body))
	if printBodyBool {
		fmt.Println(string(body))
	}
}
