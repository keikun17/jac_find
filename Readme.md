Used to crawl a specific site to check if my package has an AWB already

Install
----
    `npm install jac_find`

Development
----

Make changes to `bin` and `src`. `src` compiles to `lib`

    babel -d src lib

Usage
----

    $> jac_find --from 50060 --to 51060 --text MYNAME`

    Options :
      from - starting from this jac package id
      to   - search until this packageid
      text - (OPTIONAL) only print out tracking ids that whose recipients contain the text

      * package id is the number at the end of the jac url
        ex : http://tracker.johnnyairplus.com/client/tracking/190703
        190703 is a package id

