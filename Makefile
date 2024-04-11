run: run-android 

run-android:
	cd app && npm run android

run-ios:
	cd app && npm run ios -- --simulator='iPhone 14 Pro Max'

server:
	.. source/bin/activate && cd api && python manage.py runserver

redis:
	redis-server
