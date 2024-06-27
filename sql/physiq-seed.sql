INSERT INTO families (name, email, password, is_admin) 
    VALUES ('testfamily', 
            'testfamily@user.com', 
            '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
            FALSE
            ),
            ('testadmin', 
            'testadmin@admin.com', 
            '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
            TRUE
            );

INSERT INTO users (family_id, first_name, last_name, birthday) 
    VALUES (1, 
            'John', 
            'Smith',
            '1980-01-01'
            ),
            (1, 
            'Jane', 
            'Smith',
            '1985-11-21'
            ),
            (2, 
            'Fred', 
            'Williams',
            '1970-12-30'
            ),
            (2, 
            'Kate', 
            'Williams',
            '1970-3-19'
            );

INSERT INTO allergies (user_id, name, reaction, notes) 
    VALUES (1, 
            'peanut', 
            'anaphylactic shock',
            'SEVERE reaction- has difficulty breathing'
            ),
            (3, 
            'lactose', 
            'upset stomach', 
            'uses lactaid tablets and lactose-free products'),
            (4, 
            'lisinopril', 
            'hives and itching', 
            'MODERATE reaction- causes itching and hives within 30 minutes of use'
            );


INSERT INTO allergies (user_id, name, reaction) 
    VALUES (2, 
            'seasonal',
            'stuffy nose and sneezing, watery eyes'
            ),
            (2, 
            'cats', 
            'stuffy nose and sneezing');

INSERT INTO symptoms (user_id, name, start_date, end_date, notes) 
    VALUES (1, 
            'hip pain',
            '2008-01-01',
            '2020-12-30',
            'Possibly caused by football injury in high school. Resolved by hip surgery in 2020.'
            );

INSERT INTO symptoms (user_id, name, start_date, notes) 
    VALUES (2, 
            'migraines',
            '2024-05-01',
            'Plan to see doctor about it by end of summer.'
            ),
             (3, 
            'irregular menstrual cycle',
            '2023-05-21',
            'Possibly caused by hormonal issues. Need to see gynecologist.'
            ),
             (4, 
            'dental pain',
            '2024-06-11',
            'Mouth ulcer. Need to get some oragel for pain.'
            );

INSERT INTO doctors (user_id, name, specialty, clinic, address, phone, notes)
    VALUES (1,
            'Dr. Katz',
            'Medical- GI Doctor',
            'Main Street Specialists',
            '100 Main Street, Townville, OP',
            '555-333-1234 ext. 312',
            'Seen for diverticulitis since 2021'
            ),
            (2,
            'Dr. Patel',
            'Gynecologist',
            'Womens Health',
            '300 Jackson Avenue, Townville, OP',
            '(555) 333-7890',
            'Seen for hormone monitoring since 2018'
            ),
            (3,
            'Dr. Hendrix',
            'Dentist',
            'Thomasville Dental',
            '500 Cameron Lane, Thomasville, OP',
            '(111) 222-3333',
            'Seen for yearly dental check-ups since 2014'
            ),
            (4,
            'Dr. Miguel',
            'Optometrist',
            'Thomasville Vision',
            '600 Jones Drive, Thomasville, OP',
            '(111) 222-6666',
            'Seen for yearly eye exams since 2023'
            ); 

INSERT INTO diagnoses (user_id, name, date_received, notes)
    VALUES (1,
            'diverticulitis',
            '2021-05-15',
            'Discovered after severe stomach pains after eating a bag of sunflower seeds.'
            ),
            (2,
            'PCOS',
            '2018-11-21',
            'Started causing issues in 2018- irregular cycles and increased pain.'
            ),
            (3,
            'eczema',
            '2015-02-27',
            'Started using oatmeal lotions and got rid of dairy, and that helped clear it up. Still have flare ups sometimes.'
            ),
            (4,
            'hypertension',
            '2020-06-11',
            'Found after having lots of headaches. Started blood pressure medications that helped.'
            ); 

INSERT INTO visits (user_id, doctor_id, title, date, description)
    VALUES (1,
            1,
            'Follow-up visit after colon-resection surgery',
            '2024-03-01',
            'Doctor Katz said stitches looked good and that I have recovered well. Instructed me to continue low-fiber diet.'
            ),
            (2,
            2,
            'Seen for severe abdominal cramps',
            '2024-04-04',
            'Doctor Patel said I might need to be checked for endometriosis. Will follow up next month.'
            ),
            (3,
            3,
            'Seen for pain in left lower jaw',
            '2024-01-04',
            'Dr. Hendrix found 3 cavities. Have to follow up for fillings soon.'
            ),
            (4,
            4,
            'Yearly Eye Exam',
            '2024-04-06',
            'Dr. Miguel said eyes look good. Just to wear reading glasses when I read if things look blurry.'
            ); 

INSERT INTO meds (user_id, prescriber_id, name, start_date, end_date, indication, dose, notes)
    VALUES (1,
            1,
            'pantoprazole',
            '2024-03-01',
            '2024-09-01',
            'gastric reflux',
            '40mg oral daily',
            'Take with food and a glass of water. Supposed to take for six months.'  
             );

INSERT INTO meds (user_id, prescriber_id, name, start_date, indication, dose, notes)
    VALUES (2,
            2,
            'claritin',
            '2022-03-01',
            'seasonal allergies',
            '10mg oral daily',
            'Take daily as needed. Especially during season changes and spring time.' 
             ),
             (3,
            3,
            'ibuprofen',
            '2022-03-01',
            'dental pain',
            '320mg oral three times a day',
            'Take daily as needed every eight hours for dental pain.' 
             ),
             (4,
            4,
            'lipitor',
            '2022-03-01',
            'high cholesterol',
            '150mg oral daily at night',
            'Take daily at bedtime.' 
             ); 

INSERT INTO images (user_id, path)
    VALUES (1,
            'https://www.medicareinteractive.org/images/medicarecard.jpg'
             ),
             (1,
            'https://www.bcbsnd.com/content/dam/bcbsnd/images/general/providers/back-of-card-3.jpg'
             ),
             (2,
            'https://www.tdi.texas.gov/artwork/compliance/bcbstx.png'
             ),
             (2,
            'https://www.bcbsnd.com/content/dam/bcbsnd/images/general/providers/back-of-card-3.jpg'
             ),
             (3,
            'https://www.medicareinteractive.org/images/medicarecard.jpg'
             ),
             (3,
            'https://www.bcbsnd.com/content/dam/bcbsnd/images/general/providers/back-of-card-3.jpg'
             ),
             (4,
            'https://www.tdi.texas.gov/artwork/compliance/bcbstx.png'
             ),
             (4,
            'https://www.bcbsnd.com/content/dam/bcbsnd/images/general/providers/back-of-card-3.jpg'
             ); 

INSERT INTO insurance (user_id, type, company_name, insured_name, start_date, end_date, group_num, contract_num, notes, front_image_id, back_image_id)
    VALUES (1,
            'medical',
            'Medicare',
            'John K. Smith',
            '2024-01-01',
            '2024-12-31',
            '123456',
            'DSA9888DSSFI',
            'Free health insurance. Remember to fill out paperwork again in November to reapply for free program.',
            1,
            2
             ),
             (2,
             'medical',
            'Blue Cross Blue Shield',
            'Jane L. Smith',
            '2024-01-01',
            '2024-08-31',
            '123456',
            'LKJM9821DSSFI',
            'Insured through temp agency. Will need new insurance at the end of temp job in September.',
             3,
             4
             ),
             (3,
             'medical',
            'Medicare',
            'Fred J. Williams',
            '2024-01-01',
            '2024-12-31',
            '123456',
            'DSKP093DSSFI',
            'Free health insurance. Remember to fill out paperwork again in November to reapply for free program.',
              5,
              6
             ),
             (4,
             'medical',
            'BCBS',
            'Kate N. Williams',
            '2024-01-01',
            '2024-12-31',
            '123456',
            'FG1E88DSSFI',
            'Insured through spouses employer. May need his info when using.',
              7,
              8
             );







   