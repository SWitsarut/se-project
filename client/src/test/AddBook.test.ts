import { describe, expect, test } from '@jest/globals';
import { AddbookFormType } from "../types/book";

// add book
export const POST = async (req: any, session: any, prisma: any, NextResponse: any) => {

  if(!session || session.user.role !== "PUBLISHER") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { isbn, title, cover, price, categoryName, authorNames, genreNames, pdfUrl, description }: AddbookFormType = await req.json();
  
  if(!isbn || !title || !price || !categoryName) {
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  if(Number(price) < 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }
  
  if(authorNames.length < 1) {
    return NextResponse.json({ error: "Author is required at least 1 author" }, { status: 400 });
  }

  if(!cover) {
    return NextResponse.json({ error: "Image cover is required" }, { status: 400 })
  }
  

  if(!pdfUrl) {
    return NextResponse.json({ error: "PDF file is required" }, { status: 400 });
  }

  try {
    const publisher = await prisma.publisher.findFirst({
      where: {
        manager: {
          some: {
            username: session.user.username
          }
        }
      }
    })
  
    if(!publisher || !publisher.publisherName) {
      return NextResponse.json({ error: "Publisher is required" }, { status: 403 });
    }

    const existingBook = await prisma.book.findFirst({
      where: {
        OR: [
          { isbn },
          { title },
        ]
      }
    })

    if(existingBook) {
      return NextResponse.json({ error: "Already have a book" }, { status: 400 });
    }

    await prisma.book.create({
      data: {
        isbn,
        title,
        price: Number(price),
        description,
        cover,
        pdfUrl,
        category: {
          connectOrCreate: {
            where: { categoryName },
            create: { categoryName },
          },
        },
        publisher: {
          connect: {
            publisherName: publisher.publisherName
          }
        },
        genres: {
          connectOrCreate: genreNames.map(name => ({
            where: { genreName: name },
            create: { genreName: name },
          }))
        },
        authors: {
          connectOrCreate: authorNames.map(name => ({
            where: { authorName: name },
            create: { authorName: name },
          }))
        },
      },
    });

    return NextResponse.json({ message: "Add book successful" }, { status: 201 });
  } catch (error) {
    console.log("Error at /api/publisher/manage-book POST", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

const createMockRequest = (data: any) => ({
  json: () => Promise.resolve(data),
});

const createMockSession = (role: string, publisher: string | null = null) => ({
  user: {
    name: undefined,
    email: 'test@example.com',
    image: undefined,
    id: '7928d07b-0f52-4da2-8223-27c16bb2d0d1',
    username: 'testuser',
    displayName: 'Test User',
    role,
    publisher,
  },
});

const createMockPrisma = (publisherFound = false, bookFound = false, bookCreateSuccess = false) => ({
  publisher: {
    findFirst: jest.fn().mockResolvedValue(publisherFound ? {publisherName: "name"} : null),
  },
  book: {
    findFirst: jest.fn().mockResolvedValue(bookFound ? {} : null),
    create: jest.fn().mockResolvedValue(bookCreateSuccess ? {} : new Error()),
  },
});

const createMockResponse = () => ({
  json: jest.fn(),
});

describe('normal inputs', () => {
  test('should return success message', async () => {
    const req = createMockRequest({
        isbn: '1234567890',
        title: 'Title',
        cover: 'cover-url',
        price: '900',
        categoryName: 'Test Category',
        authorNames: ['Author 1', 'Author 2'],
        genreNames: ['Genre 1', 'Genre 2'],
        pdfUrl: 'pdf-URL',
        description: 'text description <>'
    });
  
    const session = createMockSession('PUBLISHER', 'LEAGUE OF GAYS');
  
    const prisma = createMockPrisma(true, false, true);
  
    const NextResponse = createMockResponse();

    await POST(req, session, prisma, NextResponse);

    expect(prisma.publisher.findFirst).toHaveBeenCalled();
    expect(prisma.book.findFirst).toHaveBeenCalled();
    expect(prisma.book.create).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(expect.any(Object), {status: 201});
  });
});

// describe('handles abnormal input data', () => {
//   test('negative price', async () => {
//     const req = createMockRequest({
//       isbn: '1234567890',
//       title: 'Test Book',
//       cover: 'cover-url',
//       price: '19.99',
//       categoryName: 'Test Category',
//       authorNames: ['Author 1', 'Author 2'],
//       genreNames: ['Genre 1', 'Genre 2'],
//       pdfUrl: 'pdf-url',
//       description: 'Test Description',
//     })

//     const session = {
//       user: {
//         name: undefined,
//         email: 'admin@admin.com',
//         image: undefined,
//         id: '7928d07b-0f52-4da2-8223-27c16bb2d0d1',
//         username: 'admin',
//         displayName: 'admin',
//         role: 'PUBLISHER',
//         publisher: 'League of Gays'
//       },
//     };

//     const prisma = {
//       publisher: {
//         findFirst: jest.fn().mockResolvedValue({ publisherName: 'something' }),
//       },
//       book: {
//         findFirst: jest.fn().mockResolvedValue(null),
//         create: jest.fn().mockResolvedValue({}),
//       },
//     };

//     const NextResponse = {
//       json: jest.fn(),
//     };

//     await POST(req, session, prisma, NextResponse);

//     expect(prisma.publisher.findFirst).not.toHaveBeenCalled();
//     expect(prisma.book.findFirst).not.toHaveBeenCalled();
//     expect(prisma.book.create).not.toHaveBeenCalled();
//     expect(NextResponse.json).toHaveBeenCalledWith({ error: "Invalid price" }, { status: 400 });
//   });

//   test('handles incomplete input data', async () => {
//     const req = {
//       json: () => Promise.resolve({
//         isbn: '1234567890',
//         title: '',
//         cover: 'cover-url',
//         price: '19.99',
//         categoryName: 'Test Category',
//         authorNames: ['Author 1', 'Author 2'],
//         genreNames: ['Genre 1', 'Genre 2'],
//         pdfUrl: '',
//         description: '',
//       }),
//     };

//     const session = {
//       user: {
//         name: undefined,
//         email: 'admin@admin.com',
//         image: undefined,
//         id: '7928d07b-0f52-4da2-8223-27c16bb2d0d1',
//         username: 'admin',
//         displayName: 'admin',
//         role: 'PUBLISHER',
//         publisher: 'League of Gays'
//       },
//     };

//     const prisma = {
//       publisher: {
//         findFirst: jest.fn().mockResolvedValue({ publisherName: 'something' }),
//       },
//       book: {
//         findFirst: jest.fn().mockResolvedValue(null),
//         create: jest.fn().mockResolvedValue({}),
//       },
//     };

//     const NextResponse = {
//       json: jest.fn(),
//     };

//     await POST(req, session, prisma, NextResponse);

//     expect(prisma.publisher.findFirst).not.toHaveBeenCalled();
//     expect(prisma.book.findFirst).not.toHaveBeenCalled();
//     expect(prisma.book.create).not.toHaveBeenCalled();
//     expect(NextResponse.json).toHaveBeenCalledWith({ error: "Invalid Input" }, { status: 400 });
//   });

//   test('not a publisher', async () => {
//     const req = {
//       json: () => Promise.resolve({
//         isbn: '1234567890',
//         title: 'hello',
//         cover: 'cover-url',
//         price: '100',
//         categoryName: 'Test Category',
//         authorNames: ['Author 1', 'Author 2'],
//         genreNames: ['Genre 1', 'Genre 2'],
//         pdfUrl: 'an-url',
//         description: '',
//       }),
//     };

//     const session = {
//       user: {
//         name: undefined,
//         email: 'tryhard@email.com',
//         image: undefined,
//         id: '7928d07b-0f52-4da2-8223-27c16bb2d0d1',
//         username: 'tryhard',
//         displayName: 'tryhard',
//         role: 'USER',
//         publisher: null
//       },
//     };

//     const prisma = {
//       publisher: {
//         findFirst: jest.fn().mockResolvedValue(null),
//       },
//       book: {
//         findFirst: jest.fn().mockResolvedValue(null),
//         create: jest.fn().mockResolvedValue({}),
//       },
//     };

//     const NextResponse = {
//       json: jest.fn(),
//     };

//     await POST(req, session, prisma, NextResponse);

//     expect(prisma.publisher.findFirst).not.toHaveBeenCalled();
//     expect(prisma.book.findFirst).not.toHaveBeenCalled();
//     expect(prisma.book.create).not.toHaveBeenCalled();
//     expect(NextResponse.json).toHaveBeenCalledWith({ error: "Access denied" }, { status: 403 });
  // });
// });
