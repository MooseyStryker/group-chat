'use strict';

const { Group } = require('../models')
const { generateRandomSeed } = require('../../utils/seed_generator')

let options = {};
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // We define the schema in the options objust to allow render to create a database in production
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: "Hackathon 2025",
        description: "A 48-hour coding marathon where developers collaborate to create innovative software solutions.",
        private: false,
        groupInvitation: generateRandomSeed()
      },
      {
        organizerId: 2,
        name: "CodeCamp",
        description: "An intensive bootcamp designed to teach coding fundamentals and advanced programming skills.",
        private: true,
        groupInvitation: generateRandomSeed()
      },
      {
        organizerId: 2,
        name: "CodeCamp But more extensive",
        description: "An intensive bootcamp designed to teach coding fundamentals and advanced programming skills plus more!!.",
        private: true,
        groupInvitation: generateRandomSeed()
      },
      {
        organizerId: 3,
        name: "AI Symposium",
        description: "A symposium focusing on the latest developments in artificial intelligence and machine learning.",
        private: false,
        groupInvitation: generateRandomSeed()
      },
      {
        organizerId: 4,
        name: "DevOps Workshop",
        description: "A hands-on workshop for learning and implementing DevOps practices and tools.",
        private: false,
        groupInvitation: generateRandomSeed()
      },
      {
        organizerId: 5,
        name: "Open Source Conference",
        description: "A conference dedicated to promoting and discussing open-source software and community contributions.",
        private: false,
        groupInvitation: generateRandomSeed()
      },
      {
        organizerId: 6,
        name: "Cyber Security Summit",
        description: "An in-depth summit focusing on the latest trends and techniques in cyber security.",
        private: true,
        groupInvitation: generateRandomSeed()
      },
      {
        organizerId: 7,
        name: "Blockchain Expo",
        description: "An expo showcasing the latest advancements and applications of blockchain technology.",
        private: false,
        groupInvitation: generateRandomSeed()
      },
      {
        organizerId: 8,
        name: "UX/UI Design Workshop",
        description: "A workshop dedicated to teaching best practices in user experience and user interface design.",
        private: true,
        groupInvitation: generateRandomSeed()
      },
      {
        organizerId: 9,
        name: "Data Science Meetup",
        description: "A meetup for data scientists to share insights, techniques, and tools.",
        private: false,
        groupInvitation: generateRandomSeed()
      },
      {
        organizerId: 10,
        name: "Cloud Computing Conference",
        description: "A conference exploring the latest developments and innovations in cloud computing.",
        private: false,
        groupInvitation: generateRandomSeed()
      },
      {
        organizerId: 8,
        name: "Biodex",
        description: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros.",
        groupInvitation: generateRandomSeed(),
        private: false
      }, {
        organizerId: 1,
        name: "Stim",
        description: "Proin risus. Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.",
        groupInvitation: generateRandomSeed(),
        private: true
      },
      {
        organizerId: 2,
        name: "Camooweal Airport",
        description: "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 5,
        name: "Eisenach-Kindel Airport",
        description: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 3,
        name: "Modlin Airport",
        description: "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 10,
        name: "Whakatane Airport",
        description: "Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.\n\nPhasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 10,
        name: "Egal International Airport",
        description: "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 10,
        name: "Shijiazhuang Daguocun International Airport",
        description: "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 9,
        name: "Fasa Airport",
        description: "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 8,
        name: "Corvo Airport",
        description: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 3,
        name: "Alligandi Airport",
        description: "Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 2,
        name: "Padova Airport",
        description: "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 2,
        name: "Soldotna Airport",
        description: "Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 3,
        name: "Tinboli Airport",
        description: "In congue. Etiam justo. Etiam pretium iaculis justo.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 8,
        name: "Wake Island Airfield",
        description: "Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 10,
        name: "Campo Mourão Airport",
        description: "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.\n\nCurabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.\n\nInteger tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 7,
        name: "Hamilton International Airport",
        description: "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.\n\nCurabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 4,
        name: "Rurutu Airport",
        description: "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.\n\nMorbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.\n\nFusce consequat. Nulla nisl. Nunc nisl.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 7,
        name: "Mitiaro Island Airport",
        description: "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.\n\nFusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.\n\nSed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 4,
        name: "Maria Montez International Airport",
        description: "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.\n\nMaecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 10,
        name: "Amedee Army Air Field",
        description: "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.\n\nFusce consequat. Nulla nisl. Nunc nisl.\n\nDuis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 2,
        name: "Katiola Airport",
        description: "Sed ante. Vivamus tortor. Duis mattis egestas metus.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 3,
        name: "Gusap Airport",
        description: "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 5,
        name: "Gujrat Airport",
        description: "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 1,
        name: "Baker City Municipal Airport",
        description: "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.\n\nNullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.\n\nIn quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 4,
        name: "N'Gaoundéré Airport",
        description: "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.\n\nMaecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.\n\nCurabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 9,
        name: "Porto de Moz Airport",
        description: "Phasellus in felis. Donec semper sapien a libero. Nam dui.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 10,
        name: "Rivers Airport",
        description: "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 1,
        name: "Cayana Airstrip",
        description: "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 9,
        name: "Guaratinguetá Airport",
        description: "Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.\n\nMauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.\n\nNullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 8,
        name: "Moundou Airport",
        description: "Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 9,
        name: "Pasighat Airport",
        description: "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 4,
        name: "Batangafo Airport",
        description: "Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.\n\nIn sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.\n\nSuspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 10,
        name: "Gabbs Airport",
        description: "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.\n\nCurabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 1,
        name: "Edmond Cané Airport",
        description: "Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 10,
        name: "Diagoras Airport",
        description: "Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.\n\nPraesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.\n\nCras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 2,
        name: "Kaolack Airport",
        description: "Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 2,
        name: "Kanainj Airport",
        description: "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 10,
        name: "Schoolcraft County Airport",
        description: "Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.\n\nDonec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 5,
        name: "Ramechhap Airport",
        description: "Sed ante. Vivamus tortor. Duis mattis egestas metus.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 9,
        name: "Tanah Merah Airport",
        description: "Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.\n\nQuisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 7,
        name: "San Luis County Regional Airport",
        description: "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.\n\nMaecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.\n\nCurabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 8,
        name: "Valdez Pioneer Field",
        description: "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 10,
        name: "Baudette International Airport",
        description: "Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 5,
        name: "Leipzig/Halle Airport",
        description: "Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.\n\nDonec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 5,
        name: "Fukue Airport",
        description: "Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 7,
        name: "Robe Airport",
        description: "Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.\n\nIn sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 7,
        name: "Zalingei Airport",
        description: "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 4,
        name: "Nizhny Novgorod Strigino International Airport",
        description: "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 8,
        name: "Lakeland-Noble F. Lee Memorial field",
        description: "Fusce consequat. Nulla nisl. Nunc nisl.\n\nDuis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 3,
        name: "Moolawatana Airport",
        description: "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 4,
        name: "Cavern City Air Terminal",
        description: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.\n\nSed ante. Vivamus tortor. Duis mattis egestas metus.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 4,
        name: "Celaque Airport",
        description: "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.\n\nIn quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 2,
        name: "Pokhara Airport",
        description: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.\n\nPraesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 2,
        name: "Koliganek Airport",
        description: "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 10,
        name: "Otu Airport",
        description: "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 8,
        name: "Land's End Airport",
        description: "Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 10,
        name: "Summit Airport",
        description: "Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.\n\nAenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 2,
        name: "Decatur HI-Way Airfield",
        description: "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 8,
        name: "Indian Mountain LRRS Airport",
        description: "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
        private: false,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 5,
        name: "Maewo-Naone Airport",
        description: "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
        private: true,
        groupInvitation: generateRandomSeed()
      }, {
        organizerId: 2,
        name: "Richmond Airport",
        description: "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.",
        private: false,
        groupInvitation: generateRandomSeed()
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Groups'

    return queryInterface.bulkDelete(options, null, {})
  }
};
