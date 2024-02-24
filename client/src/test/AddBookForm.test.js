import { describe, expect, test } from '@jest/globals';
import { POST } from '../app/api/publisher/manage-book/route'; // Import the POST function

describe('add book', () => {
  test('should return a success message when adding a book', async () => {
    const req = {
      json: () => Promise.resolve({
        isbn: '1234567890',
        title: 'Test Book',
        cover: 'cover-url',
        price: '19.99',
        categoryName: 'Test Category',
        authorNames: ['Author 1', 'Author 2'],
        genreNames: ['Genre 1', 'Genre 2'],
        pdfUrl: 'pdf-url',
        description: 'Test Description',
      }),
    };

    // Mock session to simulate a user with PUBLISHER role
    const session = {
      user: {
        role: 'PUBLISHER',
        username: 'IMGAY',
      },
    };

    // Mock the prisma functions
    const prisma = {
      publisher: {
        findFirst: jest.fn().mockResolvedValue({ publisherName: 'Test Publisher' }),
      },
      book: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({}),
      },
    };

    // Mock NextResponse
    const NextResponse = {
      json: jest.fn(),
    };

    // Call the POST function with mocked parameters
    await POST(req, session, prisma, NextResponse);

    // Expectations
    expect(prisma.publisher.findFirst).toHaveBeenCalled();
    expect(prisma.book.findFirst).toHaveBeenCalled();
    expect(prisma.book.create).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ message: "Add book successful" }, { status: 201 });
  });
});
