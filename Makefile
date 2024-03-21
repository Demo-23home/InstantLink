run-android:
	cd app && npm run android

run-ios:
	cd app && npm run-ios


server:
	. env/bin/activate && cd api && python manage.py runserver