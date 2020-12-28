Author: Ghanendra Piplani

1. The code for Assignment part 1 is present in the directory mywebsite. To test the code, open the directory mywebsite in the terminal and execute wrangler dev.
2. The code for Assignment part 2 is present in the directory systems-engineering-assignment. To build and execute the code: 
cd systems-engineering-assignment/main/
go build
main.exe --url <https-website-url> --profile <integer-value> --printbody <integer-value>

In the main.exe the parameters are:
1. url -> Accepts a string value for a URL.
2. profile -> Accepts integer value, number of times the url must be hit, by default is 1.
3. printbody -> If value passed is 0, the body of the response received from hitting the URL would not be printed to console, otherwise will print. By default 
is 0.

Observations:

When I requested the website developed by me at https://myapp.gpiplani.workers.dev/links the first time request took 430 ms which was the slowest, subsequent
request times got reduced by almost 97% when tested 100 times. Tested 2 other popular websites gmail.com and news.google.com, found that there was a reduction 
in response time after first request by almost 64% in both the cases. Hence our website which resides on the cloudflare network performed significantly better
than other 2 websites. Although it should be noted that the data being recieved from both the websites was more than the one developed by me.
