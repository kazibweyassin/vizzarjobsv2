#write a funtion that accept the user his name , must be 18 above , if not reject , if not muslim reject , 
# if not accept the user name and age and return a message with his name and age
def user_info():
    name = input("Please enter your name: ")
    age = int(input("Please enter your age: "))
    
    if age < 18:
        return "You must be 18 or older to play this game."
    
    religion = input("Please enter your religion (Muslim/Non-Muslim): ").strip().lower()
    if religion != "muslim":
        return "You must be Muslim to proceed."
    
    return f"Welcome {name}, you are {age} years old."