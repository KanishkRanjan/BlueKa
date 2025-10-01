

My Habit App - BlueKa
hi. this is a project i made. its a habit tracker app for your phone.

i read this book, "Atomic Habits", and it had some cool ideas. the main thing is that to build good habits, you should focus on who you want to be, not just what you want to do. like, instead of "i want to read a book", you think "i am a reader".   

so i tried to make an app based on that. every time you do a habit, it's like you're casting a vote for the person you want to become.   

What it does
Identity-Based Habits: The first thing you do is decide what kind of person you want to be. like "I am a writer" or "I am an athlete".   

Start Small (2-Minute Rule): The book says any new habit should take less than two minutes. so when you make a new habit like "read more", the app will suggest something small like "read one page". the point is just to show up.   

Habit Stacking: You can link a new habit to one you already do. like "After I brush my teeth, I will meditate for one minute".   

Temptation Bundling: You can link something you need to do with something you want to do. like "I will only listen to my favorite podcast when I'm on a run".   

It feels good: when you finish a habit, there's a nice animation and a little buzz. it's supposed to be satisfying so your brain wants to do it again.   

Tech stuff I used
i'm still learning a lot of this so i tried to keep it simple.

The App (Frontend): It's a React Native app. I used Expo because it's just easier to get started than the normal React Native CLI.

The Server (Backend): For the backend, I made a server with Node.js and Express. This is what the app talks to, to save and get all your habits and stuff. You can't just connect the app straight to the database, that's a really bad idea.

The Database: I used MySQL to store all the data.

Styling: I used NativeWind, which is basically Tailwind CSS for React Native. It makes styling faster than writing all the StyleSheet stuff by hand.

State Management: To handle the data inside the app, I used Zustand. I looked at Redux but it seemed like a lot of work. Zustand is way simpler.   

