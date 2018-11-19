# heke
A collection of handlebars helpers

### Usage

import heke from 'heke'

heke()


#### Helpers

1. trim
2. prettyDate
3. uglyDate
4. replaceValue
5. strip
6. find
7. deg2dir
8. concat
9. date
10. replaceFirst
11. now
12. determineValue
13. isNaN
14. includes
15. split

### trim
The trim helper simply applies the trim() function to the string, for removing unneeded whitespace.

### prettyDate 
Takes a unix timestamp in seconds and returns the date.toString() value to give a much more detailed and readable date

### uglyDate 
Takes a string date and turns it into a unix timestamp in seconds, which should be used for the updated property of the main report node. uglyDate accepts 2 arguments (inputDateFormat and timezone). Since some string dates are weird and don't conform to any known date format, we can use inputDateFormat, which uses [moment.js](http://momentjs.com/) to define how we should read the date. The timezone argument simply sets the timezone so we don't have to pull it from the auth service. This is needed since unix timestamps are always in UTC time. An example usage of uglyDate might be ```{{uglyDate squaw.RESORT.INFODATE 'DD/MM/YYYY HH:mm' 'America/Los_Angeles'}}```

### replaceValue
Sometimes feeds don't actually have the value we want to display, For example, Squaw has a feed from Lumiplan which is half French, half just plain weird/cryptic, so we have to transform status values into something meaningful.

replaceValue takes a single argument, but it's a JSON array of objects, each object having two properties, "search" and "replaceWith". So for that specific property we're processing we can provide an unlimited number of options to search for and what we'll replace it with.
Using Squaw's feed as an example, we use this for lifts:

```{{replaceValue squawLiftStatus '[{"search": "O", "replaceWith": "OPEN"}, {"search": "P", "replaceWith": "SCHEDULED"}, {"search": "C", "replaceWith": "CLOSED"}, {"search": "OO", "replaceWith": "CLOSED"}]'}}```

We could also use this if we wanted a name to display differently: 

```{{replaceValue squawSomeName '[{"search": "Marrilacs 5 Tree R", "replaceWith": "Marrilacs 5th Tree Run"}]'}}```

### strip

replaceValue looks at the entire value and replaces the entire value. Sometimes values have added characters that we don't want to include, so for this, just use the strip helper. It takes one parameter, the string you want stripped. eg.

```{{strip squawSomeTemperature '+'}}``` (Changes "+45" to "45")

If you provide an array, you can strip multiple strings:


```{{strip squawSomeTemperature '["+","°F"," "]'}}``` (Removes plus sign, temperature units and left over spaces

### find 

Allows you to grab a value of a property of an object, from an array of objects, using a property's value to find the object when it's in an array.

Usage: ```status="{{find 'Code' StatusCode @root.facilities.ServiceStatus.Status 'Description'}}"```
We find the object where `Code` is equal to StatusCode (which is a variable, so might be the value "C", for example), in the array of objects called `@root.facilities.ServiceStatus.Status`, returning the value of the `Description` property.

If you omit the last value, find will return the entire object to work with.

### deg2Dir

Converts degrees to a wind direction, such as N, S, E, W, ENE, etc
Usage: ```{{deg2Dir (find 'location' 'RHT' @root.weatherStations 'windDir')}}```

Note the usage of `(` brackets to nest helper calls

### concat

Simply combines all items into a long string
eg: ```{{'you' '-' 'are' '-' 'a' '-' 'robot'}}``` will return `you-are-a-robot`

### date

This is pretty much instantiating moment with a specific format and sending back the result
It takes up to 4 arguments, the last 3 being optional - format, current time, current time format, timezone
eg: ```{{date 'ha' '2016-12-12 18:00' 'YYYY-mm-dd HH:mm'}}``` will return `6pm`
If you're converting from a timezone free format like a unix timestamp, use a timezone:
```{{date 'YYYY-MM-DD HH:mm:ss' '1512070674' 'X' 'America/Denver'}}``` will return `2017-11-30 12:37:54`

### replaceFirst

Is a stripped back version of replaceValue that doesn't take an object to search and replace multiple options, it's just two strings, look for the first occurrence of a string and replace it with the other string
eg: ```{{replaceFirst my.trail.with.weird.name ' - ' ''}}``` will change ' - myTrail' to 'myTrail'


### now

now is just a simple way to use moment.js with timezone. It just grabs the current time, in the format you want, in the timezone you want. 
eg: ```{{now 'ha' 'America/Los_Angeles'}}``` might display `11am`


### determineValue
Allows us to look at a list of other values and if a certain value exists, to use that as the determined value. This is used to look at lift and trail status, and determine what the overall resort status is based on them.

```{{determineValue "[\"open\", \"on hold\", \"closed\"]" report.lifts.upperMountain.deltaChair.status report.lifts.upperMountain.valleyTBar.status report.lifts.upperMountain.knollRidgeTBar.status report.lifts.upperMountain.westRidgeChair.status report.lifts.upperMountain.farWestTBar.status report.lifts.lowerMountain.rangatiraExpress.status report.lifts.happyValley.happyValleyLifts.status}}```

### isNaN

isNaN Tests if you're getting a JS NaN, usually from the result of a calculation you're trying. In the example below, `someValue` could be another handlebars helper that does the calculation. 
eg: ```{{#if (isNaN someValue)}}No Number{{else}}123{{/if}}```

The code above says to check (in order) for "open" then "on hold" and then "closed", then after that is each value we want to test for that value. Once a value is found to match, that value is returned.

In this instance, because open comes first, if any lift at all is open, the resort status will be open. If nothing is open, but there's at least one lift set as on hold, the resort status will be on old, and finally, failing finding any lifts that are open or on hold, it will test to see if at least one of them is closed, and use that as the resort status.


### includes
Supply JSON array of possible values, to test if a variable is equal to one of them, returning a boolean, so probably used in conjunction with an `if` or `is`
eg: 
``` 
{{#if (includes (trim Name) '["Gagnon","Fuddle Duddle","Expo","Les Rapides"]')}}
             <trail name="{{trim Name}}"
             status="{{Status}}"
             groomed="{{Grooming}}"
             snowMaking="{{SnowMaking}}"
             difficulty="{{Difficulty}}"/>
{{/if}}
```
If the name of the trail is either Gagnon, Fuddle Duddle, Expo, or Les Rapides, it'll display trail information.


### split
Simply uses the JavaScript split function to split a string into an array
eg: 
``` 
{{first (split myString '-' )}}
```
Splits a string using the delimiter `-` and then returns the first element in the returned array. (Then uses swag to get the first element of the array)
