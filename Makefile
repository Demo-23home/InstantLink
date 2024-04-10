
run: run-android 

run-android:
	cd app && npm run android

server:
	. env/bin/activate && cd api && python manage.py runserver

