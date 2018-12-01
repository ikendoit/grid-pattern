# Grid creator

# Functions:  
  - detect a grid pattern ...
  - And generate a grid data structure from a config object
  => user can :
    + generate more points in grid ( given a bound object ( min x, min y, max x, max y )
    + modify the current grid => modify the points within that grid
      + param: Object: {
          pattern: PatternObject < mandatory >
        }
    + generate closest point in within grid to a 3rd party point

# Algorithm specs: 
  - the progam will have to: 
    + calculate angle of grid from topLefts set
    + calculate default lat - lng spacing 

# API: 

