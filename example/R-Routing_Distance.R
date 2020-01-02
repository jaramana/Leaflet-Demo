# Routing Distance
# 12/17/2019

# Set the working directory
setwd("/PATH/TO/DIRECTORY")

# Load libraries		
library(osrm)

# Bring in the data
mydata <- read.csv("coordinates.csv", stringsAsFactors=FALSE)

# Create new table to be populated
route_distance <- data.frame(i = character(), j = character (),
                   time = numeric(), distance = numeric(),
                   stringsAsFactors = F)

# Travel distance using OSRM, looped
k = 1
for (i in 1:nrow(mydata)){
   for (j in i){
     route <- osrmRoute(src = mydata[i, c(1,3,2)],
                       dst = mydata[j, c(1,5,4)], sp = T)
     route_distance[k, ] <- as.vector(route@data[1,])
     k <- k + 1
     Sys.sleep(0.5)
   }
}

#View results
route_distance 

#write csv
write.csv(route_distance, file = "coordinates_routed.csv")